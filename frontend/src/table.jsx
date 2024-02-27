// import React from 'react';

// const TableComponent = ({ data }) => {
//   if (!data || data.length === 0) {
//     return <p>No data available</p>;
//   }

//   // Extract column names from the first object in the array
//   const columns = Object.keys(data[0]);
//   console.log(columns)

//   return (
//     <table>
//       <thead>
//         <tr>
//           {columns.map((column) => (
//             <th key={column}>{column}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row, index) => (
//           <tr key={index}>
//             {columns.map((column) => (
//               <td key={column}>{row[column]}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default TableComponent;

import React from 'react';
import './styles.css'; // Import your CSS file

const TableComponent = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="no-data-message">No data available</p>;
  }

  // Extract column names from the first object in the array
  const columns = Object.keys(data[0]);

  return (
    <div className="table-container">
      <table style={{borderCollapse:"collapse"}}>
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th key={column} className="table-cell">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column} className="table-cell">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

