import React, { useState, useEffect, useContext } from "react";
import classes from "./SantaForm.module.css";
import { GlobalContext } from "../contexts/GlobalContext";
import { Popup } from "../UI/Popup";

const SantaForm = () => {
  const [alert, setAlert] = useState({
    "show": false,
    "severity": "",
    "message": "",
  });

  const ctx = useContext(GlobalContext);
  
  const onClose = () => {
    setAlert((prev) => ({
        ...prev,
        "show": false
    }))
  }

  const fetchData = async () => {
    try {
      const userProfilesResponse = await fetch(
        "https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json"
      );
      const userProfilesData = await userProfilesResponse.json();

      const usersResponse = await fetch(
        "https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json"
      );
      const usersData = await usersResponse.json();

      return {
        userProfilesData,
        usersData
      };

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target[0].value;
    const greeting = event.target[1].value;

    let {userProfilesData, usersData} = await fetchData();

    // Check if a username exists in userProfilesData
    let usernameExists = false;
    let childData = {};
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].username === name) {
            usernameExists = true;
            childData = usersData[i];
            break;
        }
    }

    //checking if username exsts or not
    if(!usernameExists ){
        setAlert((prev) => ({
            "show": true,
            "severity": "error",
            "message": "the given username does not exists!"

        }));
        document.getElementById("child-name").value = "";
        document.getElementById("greeting").value = "";
        console.log("displaying error page");
        return;
    }

    

    let childDetails = {};
    for (let i = 0; i < userProfilesData.length; i++) {
        if (userProfilesData[i].userUid === childData.uid) {
            childDetails = userProfilesData[i];
            break;
        }
    }

    // console.log(childData);
    console.log(childDetails);

    const age = getAge(childDetails.birthdate);
    console.log(`age: ${age}`);
    if(age > 10 || Number.isNaN(age) || isNaN(age)){
        setAlert((prev) => ({
            "show": true,
            "severity": "error",
            "message": "Age is greater than 10 years old. Only chidren below 10 years are allowed!"

        }));
        document.getElementById("child-name").value = "";
        document.getElementById("greeting").value = "";
        return;
    }

    let existChildren = ctx.children;
    let newChild = {
        "uid": childData.uid,
        "username": childData.username,
        "address": childDetails.address,
        "greeting": greeting
    }

    existChildren.push(newChild);


    ctx.setChildren((prevState) => (existChildren));

    setAlert((prev) => ({
        ...prev,
        "show": true,
        "severity": "success",
        "message": "Greetings registered!"

    }));

    console.log(existChildren);

    document.getElementById("child-name").value = "";
    document.getElementById("greeting").value = "";
    

    }


    const getAge = (dateString) => {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

  return (
    <div id="santa-form" className={classes.santa_form_root}>
        {alert.show && <Popup 
            severity={alert.severity}
            message={alert.message} 
            onClose={onClose}/>}
        <form onSubmit={handleSubmit} className={classes.santa_form_container}>
            <p className={classes.santa_form_title}>Welcome to the mistical land of Santa Greeting!!</p>
            <label htmlFor="child-name">Name of the Child:</label>
            <input
                className={classes.santa_form_input}
                type="text"
                id="child-name"
                name="childName"
                placeholder="Enter name of the child"
            />

            <label htmlFor="greeting">Greeting for Santa:</label>
            <textarea
                className={classes.santa_form_textarea}
                id="greeting"
                name="greeting"
                placeholder="Write your greeting for Santa here"
                rows="5"
            ></textarea>

            <button 
                className={classes.santa_form_submit}
                type="submit" 
                id="send-button" 
                name="sendButton">
                Send
            </button>
        </form>
    </div>
    
  );
};

export default SantaForm;
