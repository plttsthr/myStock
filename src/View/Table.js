import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { setDoc, doc, getDocs } from 'firebase/firestore';
import { collection, addDoc, getDoc } from 'firebase/firestore';
import {auth, storage, db} from "../Model/firebase"; 

const Table = () => {
  const [data, setData] = useState([]);

  const handleAddRow = async() => {
    const newData = [ ];
    setData([]); // Erase contents of table
    const accountRef = collection(db, "accounts", "MS00000008", "history");
    getDocs(accountRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { transaction, amount } = doc.data();
        newData.push({ transaction, amount });
      });
      setData((prevState) => [...prevState, ...newData]);
    });
  }

  const columns = [
    {
      name: 'Transaction',
      selector: row => row.transaction,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
    },
    {
      name: 'Time',
      selector: row => row.time,
      sortable: true,
    },
  ];

  return (
    <>
      <DataTable
        title="Stock Table"
        columns={columns}
        data={data}
        pagination
      />
      <div>
        <h3>Add New Row</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddRow();
          e.target.reset();
        }}>
          <button type="submit">Refresh Search</button>
        </form>
      </div>
    </>
  );
};

export default Table;