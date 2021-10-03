import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "please enter value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "Task changed! 👀");
    } else {
      showAlert(true, "success", "Task added to list!! 😃");
      const newItem = { id: new Date().getTime().toString(), title: name };

      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, "danger", "ALL TASKS DELETED!! 😲");
    setList([]);
  };
  const removeItem = (id) => {
    showAlert(true, "danger", "TASK DELETED 😨");
    setList(list.filter((item) => item.id !== id));
  };
  const completeItem = (id) => {
    showAlert(true, "success", "TASK DONE 😇");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h2 align="center">TASKS TRACKER </h2>
        <h4 align="center">(TASKS LEFT = {list.length})</h4>
        <br />
        <div className="form-control">
          <input
            type="text"
            className="task"
            placeholder="Enter a task..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit Task" : "Add Task"}
          </button>
        </div>
      </form>
      <br />
      {list.length > 0 && (
        <div className="task-container">
          <List
            items={list}
            removeItem={removeItem}
            editItem={editItem}
            completeItem={completeItem}
          />
          <button className="clear-btn" onClick={clearList}>
            Delete all Tasks!!
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
