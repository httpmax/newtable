import { useEffect, useState } from "react";
import {MdContentCopy} from "react-icons/md";
import {toast} from "react-toastify";
import {GrDrag} from "react-icons/gr";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState([{ column1: "", column2: "" }]);
  const [showCode, setShowCode] = useState(false);

  const handleShowCode = () => {
    setShowCode(true);
    /*navigator.clipboard.writeText(`<table>
    <tbody>
      ${tableData
        .map(
            (row) => `<tr>
            ${Object.entries(row)
                .map((item, i) => {
                  return i === 0 ? `<th>${item[1]}</th>` : `<td>${item[1]}</td>`;
                })
                .join("")}
          </tr>`
        )
        .join("\n")}
    </tbody>
  </table>`);
    toast.success('Copied to Clipboard', {autoClose: 2000,hideProgressBar: true})*/
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleConvertClick = (e) => {
    const rows = e.clipboardData?.getData("Text")
      ? e.clipboardData.getData("Text").split("\n")
      : inputValue.split("\n");
    const newData = rows.map((row) => {
      const values = row.split("\t"); // Replace with your column delimiter
      let hashmap = {};
      values.map((value, idx) => {
        let key = `column${idx + 1}`;
        hashmap[key] = value;
      });
      return hashmap;
    });
    setTableData(newData);
  };

  const handleCellValueChange = (event, rowIndex, columnName) => {
    const newData = tableData.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          [columnName]: event.target.value,
        };
      }
      return row;
    });
    setTableData(newData);
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", index);
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const dragIndex = event.dataTransfer.getData("text/plain");
    const newData = [...tableData];
    const [draggedRow] = newData.splice(dragIndex, 1);
    newData.splice(index, 0, draggedRow);
    setTableData(newData);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleAddRow = (rowIndex) => {
    const newData = [
      ...tableData.slice(0, rowIndex + 1),
      { column1: "", column2: "" },
      ...tableData.slice(rowIndex + 1),
    ];
    setTableData(newData);
  };

  const handleRemoveRow = (rowIndex) => {
    const newData = tableData.filter((row, index) => index !== rowIndex);
    setTableData(newData);
  };

  function handleAlign(arr) {
    let newarr = arr.filter(item => item.column1 !== '\r' && item.column1 !== '\n' && item.column1 !== '\r\n');
    for(let i=0; i<newarr.length; i = i+=2){
      newarr[i].column2 = newarr[i+1].column1
    }
    const result = newarr.filter(i => i.column2)
    setTableData(result);
  }
  return (
    <div className="border container mx-auto py-10">
      <div className="w-[80%] mx-auto flex flex-col">
        <textarea
          className="border w-full p-4"
          rows={10}
          placeholder="Paste Your Table here to get Started"
          value={inputValue}
          onChange={handleInputChange}
          onPaste={handleConvertClick}
        />
        <div className="flex justify-center my-6" >
          <div className="flex gap-10" >
            <button
                className="bg-red-400 p-3 px-6 rounded text-white font-bold"
                onClick={handleShowCode}
            >
              Show Code
            </button>
            <button
                className="bg-teal-400 p-3 mx-3 px-6 rounded text-white font-bold"
                onClick={() => handleAlign(tableData)}
            >
              Align
            </button>
          </div>
        </div>
        {/*<div className="flex justify-center my-10">*/}
        {/*  <button*/}
        {/*    className="bg-teal-600 p-3 px-6 rounded text-white font-bold"*/}
        {/*    onClick={handleConvertClick}*/}
        {/*  >*/}
        {/*    Convert*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>

      <div className=" flex justify-center gap-10">
        <table className="">
          {/*<thead>*/}
          {/*  <tr>*/}
          {/*    <th>Column 1</th>*/}
          {/*    <th>Column 2</th>*/}
          {/*  </tr>*/}
          {/*</thead>*/}
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr
                  draggable
                  key={rowIndex}
              >
                <td
                    style={{width:70}}
                    onDragStart={(event) => handleDragStart(event, rowIndex)}
                    onDrop={(event) => handleDrop(event, rowIndex)}
                    onDragOver={(event) => handleDragOver(event)}
                >
                  <GrDrag/>
                </td>
                {Object.entries(row).map((rowData, i) =>
                  i === 0 ? (
                    <th draggable={false} >
                      <input
                        className="border border-gray-500 h-[40px] m-3 p-2"
                        type="text"
                        draggable="true"
                        onDragStart={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        value={rowData[1]}
                        onChange={(event) =>
                          handleCellValueChange(event, rowIndex, rowData[0])
                        }
                      />
                    </th>
                  ) : (
                    <td>
                      <input
                          draggable="true"
                          onDragStart={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                        className="border border-gray-500 h-[40px] m-3 p-2"
                        type="text"
                        value={rowData[1]}
                        onChange={(event) =>
                          handleCellValueChange(event, rowIndex, rowData[0])
                        }
                      />
                    </td>
                  )
                )}

                {/*<td>*/}
                {/*  <input*/}
                {/*    type="text"*/}
                {/*    value={row.column2}*/}
                {/*    onChange={(event) =>*/}
                {/*      handleCellValueChange(event, rowIndex, "column2")*/}
                {/*    }*/}
                {/*  />*/}
                {/*</td>*/}
                <td>
                  <button
                    className="bg-gray-400 w-[40px] h-[40px] rounded mx-3 font-bold"
                    onClick={() => handleAddRow(rowIndex)}
                  >
                    +
                  </button>
                  <button
                    className="bg-gray-400 w-[40px] h-[40px] rounded mx-3 font-bold"
                    onClick={() => handleRemoveRow(rowIndex)}
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center my-5">


        </div>
      </div>

      {showCode && (
        <div className="flex justify-center my-5">

          <code className=" max-w-[80%] bg-gray-100 p-5 rounded font-mono text-[12px] text-gray-500 relative">
           /*<button
                className="absolute right-3 top-1 hover:bg-gray-300 p-2 "
                title="Copy to Clipboard"
                onClick={() => {
                  navigator.clipboard.writeText(`<table>
    <tbody>
      ${tableData
                      .map(
                          (row) => `<tr>
            ${Object.entries(row)
                              .map((item, i) => {
                                return i === 0 ? `<th>${item[1]}</th>` : `<td>${item[1]}</td>`;
                              })
                              .join("")}
          </tr>`
                      )
                      .join("\n")}
    </tbody>
  </table>`);
                  toast.success('Copied to Clipboard', {autoClose: 2000,hideProgressBar: true})
                }
                }
            >
              <MdContentCopy size={25 } className="" />
            </button>*/
            {`<table>
    <tbody>
      ${tableData
        .map(
          (row) => `<tr>
            ${Object.entries(row)
              .map((item, i) => {
                return i === 0 ? `<th>${item[1]}</th>` : `<td>${item[1]}</td>`;
              })
              .join("")}
          </tr>`
        )
        .join("\n")}
    </tbody>
  </table>`}
          </code>
        </div>
      )}
    </div>
  );
}
