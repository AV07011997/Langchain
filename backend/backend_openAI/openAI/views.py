from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt

from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain_openai import ChatOpenAI
import matplotlib.pyplot as plt
from datetime import datetime
import json


import pandas as pd
from langchain_openai import OpenAI

import os
from dotenv import load_dotenv
import openai


# Create your views here.
@api_view(['POST'])
def Upload(request):
    
    if request.method == 'POST' and request.FILES:
        target_directory = r'C:\Users\Abhishek\Documents\LLM_openAI\backend\constants'
        file_list = os.listdir(target_directory)
        for file_name in file_list:
              file_path = os.path.join(target_directory, file_name)
              try:
                  if os.path.isfile(file_path):
                       os.remove(file_path)
                       print(f"Deleted: {file_path}")
                  else:
                       print(f"Skipped: {file_path} (not a file)")
              except Exception as e:
                   print(f"Error deleting {file_path}: {e}")
        
        uploaded_files = request.FILES.getlist('files')
        for uploaded_file in uploaded_files:
             target_directory = r'C:\Users\Abhishek\Documents\LLM_openAI\backend\constants'
             file_path = os.path.join(target_directory, uploaded_file.name) 
             fs = FileSystemStorage(location=target_directory)
             fs.save(uploaded_file.name, uploaded_file)
        return JsonResponse({'message': '1'})
    else:
         return JsonResponse({'error': '0'}, status=400)

#         for uploaded_file in uploaded_files:
#              file_name, file_extension = os.path.splitext(uploaded_file.name)

#         # Change the file name to 'FILE_Uploaded' while keeping the extension intact
#         new_file_name = 'FILE_Uploaded' + file_extension

#         # Set the target directory
#         target_directory = r'C:\Users\Abhishek\Documents\LLM_openAI\backend\constants'

#         # Check if the file already exists in the target directory
#         existing_file_path = os.path.join(target_directory, new_file_name)
#         if os.path.exists(existing_file_path):
#             # If it exists, delete the existing file
#             os.remove(existing_file_path)

#         # Save the new file
#         fs = FileSystemStorage(location=target_directory)
#         saved_file = fs.save(new_file_name, uploaded_file)

#         return JsonResponse({'message': '1'})
#     else:
#         return JsonResponse({'error': '0'}, status=400)

@api_view(['POST'])
def Agent(request):
     received_string = request.data['Input_String']
     print(received_string)

     with open('.env', 'w') as f:
          pass
     with open('.env', 'w') as f:
          f.write('OPENAI_API_KEY=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')
     # Load environment variables from .env file
     load_dotenv()
     # Get the API key from the environment variables
     api_key = os.getenv("OPENAI_API_KEY")
     # Print the API key to check if it's loaded correctly
     print("API Key:", api_key)
     # Check if the API key is available
     if api_key is None:
          raise EnvironmentError("OpenAI API key not found in .env file")
     
     # Set up the OpenAI API client
     openai.api_key = api_key
     llm = OpenAI(temperature=0)  

     # folder_path = 'C:\Users\Abhishek\Documents\LLM_openAI\backend\constants\'


     # df = pd.read_excel(r"C:\Users\Abhishek\Documents\LLM_openAI\backend\constants\FILE_Uploaded.xlsx")

     folder_path = r"C:\Users\Abhishek\Documents\LLM_openAI\backend\constants"
     file_list = os.listdir(folder_path)
     df_list = []
     for i, file_name in enumerate(file_list):
          file_path = os.path.join(folder_path, file_name)
          df = pd.read_excel(file_path)
          df_list.append(df)



     agent = create_pandas_dataframe_agent(llm, df_list, verbose=True, return_intermediate_steps=True)
     # add multiple file as a list
     result = agent(received_string)
     intermediate_steps = result['intermediate_steps']
     final_output = result['output']
     df_json=None
     try:
          for i in intermediate_steps:
               if isinstance(i[1], pd.DataFrame):
                    df = pd.DataFrame(i[1])
                    # print("The variable is a DataFrame")
                    df_json = df.to_json(orient='records')
            # Process df_json or do something else with the DataFrame
               else:
                    print("The variable is not a DataFrame")
                    
     except Exception as e:
          df_json = None

     

     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
     file_name = f'C:/Users/Abhishek/Documents/LLM_openAI/frontend/constants/graphs_{timestamp}.png'


     try:
          plt.savefig(file_name)
          plt.clf()
          file_name_image = f'/constants/graphs_{timestamp}.png'
     except:
          file_name_image=None

     text_output=final_output


     



     # plt.savefig('C:/Users/Abhishek/Documents/LLM_openAI/backend/constants/graphs.png')


     
     

     return JsonResponse({"message":df_json,"image":file_name_image,"text_output":text_output})

@api_view(['GET'])
def reset():
     target_directory = r'C:\Users\Abhishek\Documents\LLM_openAI\frontend\constants'
     file_list = os.listdir(target_directory)
     for file_name in file_list:
          file_path = os.path.join(target_directory, file_name)
          try:
               if os.path.isfile(file_path):
                     os.remove(file_path)
                     print(f"Deleted: {file_path}")
               else:
                     print(f"Skipped: {file_path} (not a file)")
          except Exception as e:
               print(f"Error deleting {file_path}: {e}")
     return None


