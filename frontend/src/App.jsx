import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from "react";
import FileUpload from "react-material-file-upload";
import axios from 'axios';
import TableComponent from './table';



function App() {
  const [count, setCount] = useState(0)
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState();
  const [textOutput, setTextOutput] = useState();
  const [file, setFile] = useState(null);
  const [status,setStatus]=useState()
  const [src,setSrc]=useState()
  const[keys,setkeys]=useState()

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    setSrc(null)
    setImage(null)
    setTextOutput(null)
    if (inputText.trim() !== '') {
      // console.log(inputText)

      axios.post('http://127.0.0.1:8000/openAI/agent/', { Input_String : String(inputText)})
      .then(response => {
        if(response){
          console.log(response)
          if (JSON.parse(response.data['message'])){
            setSrc(JSON.parse(response.data['message']))

          }
          setImage(response.data['image'])
          setTextOutput(response.data['text_output'])

        }
      })
      .catch(error => {
        console.log(error)
      });
     
      setTimeout(() => {
        setMessages([...messages, { text: inputText, sender: 'chatbot' }]);
      }, 500);
      setInputText('');
    }
  };

  const [data,setdata]=useState()

 



  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   // Make a POST request to your Django backend here
  //   // Use a library like axios or fetch to handle the request
  //   // Example with axios:
  //   axios.post('http://127.0.0.1:8000/openAI/', formData)
  //     .then(response => {
  //       if(response){
  //         setStatus(JSON.parse(response.data['message']))

  //       }
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     });
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      // formData.append(`file${i + 1}`, files[i]);
      formData.append('files', files[i]);

    }

    // Make a POST request to your Django backend here
    // Use a library like axios or fetch to handle the request
    // Example with axios:
    axios.post('http://127.0.0.1:8000/openAI/', formData)
      .then(response => {
        if(response){
          setStatus(JSON.parse(response.data['message']));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(()=>{
    if (src){
      setkeys(Object.keys(src[0]));


    }


  },[src])
  


  
console.log(keys)
console.log(image )
console.log(textOutput )

const Reset=()=>{
  setImage(null)
  setSrc(null)
  setMessages([])
  setTextOutput(null)
  // axios.get('http://127.0.0.1:8000/openAI/reset/')


}

  return (
    <>
          {/* <img src="C:\Users\Abhishek\Documents\LLM_openAI\backend\constants\graphs_20240216175853.png"></img> */}
    
    <div>
        {/* <h2 style={{ textAlign: "center" }}>Upload Excel/CSV File here.</h2> */}
        {/* <FileUpload
          value={files}
          onChange={setFiles}
          multiFile={false}
          leftLabel="or"
          rightLabel="to select files"
          buttonLabel="click here"
          buttonRemoveLabel="Remove all"
          maxFileSize={10}
          maxUploadFiles={1}
          bannerProps={{ elevation: 0, variant: "outlined" }}
          containerProps={{ elevation: 0, variant: "outlined" }}
        /> */}
      </div>

      {/* <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
  <div>
    <input type="file" onChange={handleFileChange} />
    <button type="submit">Upload File</button>
  </div>
  <button onClick={Reset()} style={{ marginLeft: 'auto',background:"black" }}>Reset</button>
</form> */}
  <form style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div>
        <input type="file" onChange={handleFileChange} multiple/>
        <button type="submit" onClick={handleSubmit}>Upload File</button>
      </div>
      <button type="button" onClick={Reset} style={{ marginLeft: 'auto' }}>Reset</button>
    </form>

    

     {
      //  status && status === "1" && (
        <div>
        <div className="chat-container">
        <div className="chat-messages">

        {
  messages && messages.map((message, index) => (
    <div key={index} className={`message ${message.sender}`}>
      {message.text}
    </div>
  ))
}

          {
  image && (
    <div>
      <img src={image} alt="Image" />
    </div>
  )
}
{
  src && (
    <TableComponent data={src} />
  )
}
{
  textOutput && (
    <span>{textOutput}</span>
  )
}

        </div>
        
      </div>
      <div className="chat-input">
      <input
        type="text"
        placeholder="Type your message..."
        value={inputText}
        onChange={handleInputChange}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
    </div>

      // )
     }


  
   </>
  )
}

export default App
