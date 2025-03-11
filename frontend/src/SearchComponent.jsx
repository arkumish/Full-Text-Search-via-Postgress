import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryType, setQueryType] = useState(1);
  
  const makeAPICall = (queryTypeHere) =>{
      axios
        .get(`http://localhost:8080/search?type=${queryTypeHere}&query=${query}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch(() => setError("Error fetching search results"))
        .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    // const url = new URL("http://localhost:8080/search");
    // const params = new URLSearchParams(url.search);
    const delayDebounceFn = setTimeout(() => {
     makeAPICall(queryType);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div style={containerStyle}>
       <h3><span style={{color:"yellow"}}>🧙‍♂️ Full Text Search </span>with {queryType===1 ? "ILIKE" : "TS_VECTOR" } 🪄</h3>
      <input
        type="text"
        style={inputStyle}
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={buttonClass}>
      <button onClick={()=>{setQueryType(1);  if(!loading) makeAPICall(1)}}>Simple ILike</button>
      <button onClick={()=>{setQueryType(2); if(!loading) makeAPICall(2)}}>PG TsVECTOR</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRowStyle}>
              <th style={tableHeaderCellStyle}>ID</th>
              <th style={tableHeaderCellStyle}>Title</th>
              <th style={tableHeaderCellStyle}>Body</th>
              <th style={tableHeaderCellStyle}>Rank</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{result.id}</td>
                <td style={tableCellStyle}>{result.title}</td>
                <td style={bodyCellStyle}>{result.body}</td> {/* Full text */}
                <td style={tableCellStyle}>{result.rank?.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && query && <p>No results found.</p>
      )}
    </div>
  );
};

const buttonClass = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  alignItems: "center", 
  margin: "15px 0", 
};

// Inline CSS styles
const containerStyle = {
  maxWidth: "90%",
  margin: "0px auto",
  padding: "30px 10px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "15px",
  fontSize: "16px",
};

const tableStyle = {
  fontSize: "14px",
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const tableHeaderRowStyle = {
  backgroundColor: "black",
};

const tableHeaderCellStyle = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
  textAlign: "left",
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
  height: "80px", // Increased row height
};

const tableCellStyle = {
  padding: "12px",
  verticalAlign: "middle",
};

const bodyCellStyle = {
  ...tableCellStyle,
  whiteSpace: "normal", // Allows wrapping
  wordBreak: "break-word", // Breaks long words
  maxWidth: "800px", // Limits width to avoid overflow
};

export default SearchComponent;
