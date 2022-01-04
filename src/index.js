import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDTUq-8ACJG-siD9zMjT7I_l9QjnDfPwxg",
  authDomain: "awais-16cf3.firebaseapp.com",
  projectId: "awais-16cf3",
  storageBucket: "awais-16cf3.appspot.com",
  messagingSenderId: "313520624545",
  appId: "1:313520624545:web:e09ca64929cf53270271e0",
  measurementId: "G-RSEP2DP8YQ",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// const time = serverTimestamp();

/*************************************************** Sign In With Email & Password**************************/
function confirming() {
  // console.log("Your function is called");
  let email = document.querySelector(".email");
  let password = document.querySelector(".password");
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(user);
      alert("Your submission is successfully completed");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      // ..
    });
}
let submit = document.querySelector(".submit");
submit.addEventListener("click", confirming);

/*************************************************** Sign In With Google **************************/
let goggleSignIn = document.querySelector(".googlesignin");
const provider = new GoogleAuthProvider();
// console.log("the provider data is :", provider);
goggleSignIn.addEventListener("click", () => {
  // console.log("google sign in functionality is working");
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      alert("Your  successfully signed in google");
      // console.log(user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
});
let h2 = document.querySelector("h2");
const db = getFirestore();

/************** time function  *****************/
function Timing(time) {
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + "" + ampm;
  return strTime;
}
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // const docRef = doc(db, "Test1", "name");
    // const docSnap = await getDoc(docRef);
    // h2.innerText = docSnap.data().firstName;
    // console.log("user info is ", user);

    let inputText = document.querySelector(".user-text");
    let commitBtn = document.querySelector(".commit-btn");
    let commitList = document.querySelector(".commit-list");
    commitBtn.addEventListener("click", () => {
      displayMessage();
    });
    // console.log("everything is working fine");

    // let dataTrack = parseInt(querySnapshot._snapshot.docChanges.length);

    async function displayMessage() {
      let time = new Date();
      let dataTrack = Math.round(time.getTime() / 1000);
      console.log("The dataTrack number is :", dataTrack);
      var abc = await addDoc(collection(db, "dualchat"), {
        docTrack: dataTrack,
        currentTime: Timing(time),
        name: user.displayName,
        message1: inputText.value,
      });

      if (inputText.value != "") {
        let li = document.createElement("li");
        li.classList.add("list-Item");
        let p = document.createElement("p");
        let timeDate = document.createElement("span");
        timeDate.classList.add("current-time");
        timeDate.innerText = Timing(time);
        console.log("the time is : ", timeDate);
        let userName = document.createElement("span");
        userName.classList.add("user-name");
        let userNode = document.createTextNode(user.displayName);
        userName.appendChild(userNode);
        let paraText = document.createElement("span");
        paraText.classList.add("para-text");
        let deleteMessage = document.createElement("button");
        deleteMessage.classList.add("deleteBtn");
        let delNodeText = document.createTextNode("X");
        deleteMessage.appendChild(delNodeText);
        p.classList.add("commit-text");
        let nodeText = document.createTextNode(inputText.value);
        paraText.appendChild(nodeText);
        p.appendChild(timeDate);
        p.appendChild(userName);
        p.appendChild(paraText);
        p.appendChild(deleteMessage);
        li.appendChild(p);
        commitList.prepend(li);
        deleteMessage.addEventListener("click", () => {
          delMessage(abc.id, p);
        });

        /************************ lets try update section ***************************/
        let editBtn = document.createElement("button");
        editBtn.classList.add("editBtn");
        editBtn.innerText = "Edit";
        p.appendChild(editBtn);
        // console.log(editBtn);
        let insertedText = document.createTextNode(paraText.innerText);
        let input2 = document.createElement("input");
        input2.classList.add("editInput");
        input2.type = "input";
        input2.appendChild(insertedText);
        input2.value = input2.innerText;
        let send = document.createElement("button");
        send.classList.add("commit-btn2");
        send.innerText = "send";
        p.appendChild(input2);
        p.appendChild(send);
        input2.style.display = "none";
        send.style.display = "none";
        editBtn.addEventListener("click", () => {
          input2.value = paraText.innerText;
          input2.style.display = "inline";
          send.style.display = "inline";
          paraText.style.display = "none";
          editBtn.style.display = "none";
        });
        send.addEventListener("click", async () => {
          let time = new Date();
          paraText.innerText = input2.value;
          timeDate.innerText = Timing(time);
          input2.style.display = "none";
          send.style.display = "none";
          paraText.style.display = "inline";
          editBtn.style.display = "inline";
          const updateData = doc(db, "dualchat", `${abc.id}`);
          await updateDoc(updateData, {
            currentTime: timeDate.innerText,
            name: user.displayName,
            message1: paraText.innerText,
          });
        });
        /************************************ Reply section *********************************/

        let replyBtn = document.createElement("button");
        replyBtn.classList.add("replyBtn");
        replyBtn.innerText = "Reply";
        p.appendChild(replyBtn);
        var childContainer = document.createElement("div");
        childContainer.classList.add("child-container");
        replyBtn.addEventListener("click", () => {
          if (
            li.lastElementChild.classList.contains("child-container") == false
          ) {
            console.log("it add the div");
            li.appendChild(childContainer);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.classList.add("input3");
            let subSend = document.createElement("button");
            subSend.innerText = "send";
            subSend.classList.add("subSend");
            let hideContainer = document.createElement("span");
            hideContainer.innerText = "Hide";
            hideContainer.classList.add("minimize");
            hideContainer.addEventListener("click", () => {
              childContainer.classList.toggle("child-container-toggle");
            });
            childContainer.appendChild(hideContainer);
            childContainer.appendChild(input3);
            childContainer.appendChild(subSend);
            let commitList2 = document.createElement("ul");
            childContainer.appendChild(commitList2);
            subSend.addEventListener("click", () => {
              replyMessage();
            });
            async function replyMessage() {
              let time = new Date();
              var abc2 = await addDoc(
                collection(db, "dualchat", `${abc.id}`, "subCollection"),
                {
                  currentTime: Timing(time),
                  name: user.displayName,
                  message1: input3.value,
                }
              );
              if (input3.value != "") {
                let li = document.createElement("li");
                li.classList.add("list-Item");
                let p = document.createElement("p");
                let timeDate = document.createElement("span");
                timeDate.classList.add("current-time2");
                timeDate.innerText = Timing(time);
                let userName = document.createElement("span");
                userName.classList.add("user-name");
                let userNode = document.createTextNode(user.displayName);
                userName.appendChild(userNode);
                let paraText = document.createElement("span");
                paraText.classList.add("para-text");
                let deleteMessage = document.createElement("button");
                deleteMessage.classList.add("deleteBtn");
                let delNodeText = document.createTextNode("X");
                deleteMessage.appendChild(delNodeText);
                p.classList.add("commit-text");
                p.classList.add("commit-text2");
                let nodeText = document.createTextNode(input3.value);
                paraText.appendChild(nodeText);
                p.appendChild(timeDate);
                p.appendChild(userName);
                p.appendChild(paraText);
                p.appendChild(deleteMessage);
                li.appendChild(p);
                commitList2.prepend(li);
                deleteMessage.addEventListener("click", () => {
                  delMessage2(abc.id, abc2.id, p);
                });

                /************************ lets try update section ***************************/
                let editBtn = document.createElement("button");
                editBtn.classList.add("editBtn");
                editBtn.innerText = "Edit";
                p.appendChild(editBtn);
                // console.log(editBtn);
                let insertedText = document.createTextNode(paraText.innerText);
                let input2 = document.createElement("input");
                input2.classList.add("editInput");
                input2.type = "input";
                input2.appendChild(insertedText);
                input2.value = input2.innerText;
                let send = document.createElement("button");
                send.classList.add("commit-btn2");
                send.innerText = "send";
                p.appendChild(input2);
                p.appendChild(send);
                input2.style.display = "none";
                send.style.display = "none";
                editBtn.addEventListener("click", () => {
                  input2.value = paraText.innerText;
                  input2.style.display = "inline";
                  send.style.display = "inline";
                  paraText.style.display = "none";
                  editBtn.style.display = "none";
                });
                send.addEventListener("click", async () => {
                  let time = new Date();
                  paraText.innerText = input2.value;
                  timeDate.innerText = Timing(time);
                  input2.style.display = "none";
                  send.style.display = "none";
                  paraText.style.display = "inline";
                  editBtn.style.display = "inline";
                  const updateData = doc(
                    db,
                    "dualchat",
                    `${abc.id}`,
                    "subCollection",
                    `${abc2.id}`
                  );
                  await updateDoc(updateData, {
                    currentTime: timeDate.innerText,
                    name: user.displayName,
                    message1: paraText.innerText,
                  });
                  childContainer.appendChild(commitList2);
                });
                input3.value = "";
              } else {
                alert("You didn't enter any value in the box");
              }
            }
          }

          childContainer.classList.toggle("child-container-toggle");
          // console.log("coninued");
        });
        inputText.value = "";
      } else {
        alert(" You didn't commit anything");
      }
    }
    async function delMessage2(parentDoc, subDoc, p) {
      p.remove();
      await deleteDoc(
        doc(db, "dualchat", `${parentDoc}`, "subCollection", `${subDoc}`)
      );
    }
    async function delMessage(deldocs, p) {
      p.remove();
      await deleteDoc(doc(db, "dualchat", `${deldocs}`));
    }
    /************************************************************ Getdoc setion ******************************/

    const querySnapshot = await getDocs(collection(db, "dualchat"));
    let docArray = [];
    let track = 0;
    querySnapshot.forEach((trackDocs) => {
      docArray[track] = parseInt(trackDocs.data().docTrack);
      track += 1;
    });
    docArray.sort((a, b) => a - b);
    // console.log(("array is : ", docArray));
    // console.log(
    //   "Array is in normal form is ",
    //   docArray,
    //   " and the array in sorted form is:",
    //   sortDocArray
    // );
    for (let i = 1; i <= querySnapshot._snapshot.docChanges.length; i++) {
      querySnapshot.forEach(async (docmt) => {
        if (docArray[i - 1] == docmt.data().docTrack) {
          // console.log(
          //   "The numbers is :",
          //   docmt.data().docTrack,
          //   " and its value is ",
          //   docmt.data().message1
          // );
          let li = document.createElement("li");
          let p = document.createElement("p");
          let timeDate = document.createElement("span");
          timeDate.classList.add("current-time");
          timeDate.innerText = docmt.data().currentTime;
          let userName = document.createElement("span");
          userName.classList.add("user-name");
          let userNode = document.createTextNode(docmt.data().name);
          userName.appendChild(userNode);
          let paraText = document.createElement("span");
          paraText.classList.add("para-text");
          let deleteMessage = document.createElement("button");
          deleteMessage.classList.add("deleteBtn");
          let delNodeText = document.createTextNode("X");
          deleteMessage.appendChild(delNodeText);
          p.classList.add("commit-text");
          let nodeText = document.createTextNode(docmt.data().message1);
          paraText.appendChild(nodeText);
          p.appendChild(timeDate);
          p.appendChild(userName);
          p.appendChild(paraText);
          p.appendChild(deleteMessage);
          li.appendChild(p);
          commitList.prepend(li);
          deleteMessage.addEventListener("click", () => {
            delMessage(docmt.id, p);
          });
          /* update section **********/
          let editBtn = document.createElement("button");
          editBtn.classList.add("editBtn");
          editBtn.innerText = "Edit";
          p.appendChild(editBtn);
          // console.log(editBtn);
          let insertedText = document.createTextNode(paraText.innerText);
          let input2 = document.createElement("input");
          input2.classList.add("editInput");
          input2.type = "input";
          input2.appendChild(insertedText);
          input2.value = input2.innerText;
          let send = document.createElement("button");
          send.classList.add("commit-btn2");
          send.innerText = "send";
          p.appendChild(input2);
          p.appendChild(send);
          input2.style.display = "none";
          send.style.display = "none";
          editBtn.addEventListener("click", () => {
            input2.value = paraText.innerText;
            input2.style.display = "inline";
            send.style.display = "inline";
            paraText.style.display = "none";
            editBtn.style.display = "none";
          });
          send.addEventListener("click", async () => {
            let time = new Date();
            paraText.innerText = input2.value;
            input2.style.display = "none";
            send.style.display = "none";
            paraText.style.display = "inline";
            editBtn.style.display = "inline";
            const updateData2 = doc(db, "dualchat", `${docmt.id}`);
            await updateDoc(updateData2, {
              currentTime: Timing(time),
              name: user.displayName,
              message1: paraText.innerText,
            });
          });

          /************************************ Reply section *********************************/

          const subDocumnt = await getDocs(
            collection(db, "dualchat", `${docmt.id}`, "subCollection")
          );
          let replyBtn = document.createElement("button");
          replyBtn.classList.add("replyBtn");
          replyBtn.innerText = "Reply";
          if (subDocumnt._snapshot.docChanges.length == 1) {
            replyBtn.innerText = "1 Reply";
          }
          if (parseInt(subDocumnt._snapshot.docChanges.length) > 1) {
            replyBtn.innerText = `${subDocumnt._snapshot.docChanges.length} Replies`;
          }
          p.appendChild(replyBtn);
          var childContainer = document.createElement("div");
          childContainer.classList.add("child-container");
          replyBtn.addEventListener("click", async () => {
            console.log("reply works");
            if (
              li.lastElementChild.classList.contains("child-container") == false
            ) {
              console.log("it add the div");
              li.appendChild(childContainer);

              let input3 = document.createElement("input");
              input3.type = "text";
              input3.classList.add("input3");
              let subSend = document.createElement("button");
              subSend.innerText = "send";
              subSend.classList.add("subSend");
              let hideContainer = document.createElement("span");
              hideContainer.innerText = "Hide";
              hideContainer.classList.add("minimize");
              hideContainer.addEventListener("click", () => {
                childContainer.classList.toggle("child-container-toggle");
              });
              childContainer.appendChild(hideContainer);
              childContainer.appendChild(input3);
              childContainer.appendChild(subSend);
              let commitList2 = document.createElement("ul");
              childContainer.appendChild(commitList2);

              let docArray = [];
              let track = 0;
              subDocumnt.forEach((trackDocs) => {
                docArray[track] = parseInt(trackDocs.data().docTrack);
                track += 1;
              });
              docArray.sort((a, b) => a - b);
              console.log(
                "The docs inside is : ",
                subDocumnt._snapshot.docChanges.length
              );
              for (
                let j = 1;
                j <= subDocumnt._snapshot.docChanges.length;
                j++
              ) {
                subDocumnt.forEach((sDocs) => {
                  if (docArray[j - 1] == sDocs.data().docTrack) {
                    console.log(
                      "The numbers is :",
                      sDocs.data().docTrack,
                      " and its value is ",
                      sDocs.data().message1
                    );
                    let li = document.createElement("li");
                    li.classList.add("list-Item");
                    let p = document.createElement("p");
                    let timeDate = document.createElement("span");
                    timeDate.classList.add("current-time2");
                    timeDate.innerText = sDocs.data().currentTime;
                    let userName = document.createElement("span");
                    userName.classList.add("user-name");
                    let userNode = document.createTextNode(sDocs.data().name);
                    userName.appendChild(userNode);
                    let paraText = document.createElement("span");
                    paraText.classList.add("para-text");
                    let deleteMessage = document.createElement("button");
                    deleteMessage.classList.add("deleteBtn");
                    let delNodeText = document.createTextNode("X");
                    deleteMessage.appendChild(delNodeText);
                    p.classList.add("commit-text");
                    p.classList.add("commit-text2");
                    let nodeText = document.createTextNode(
                      sDocs.data().message1
                    );
                    paraText.appendChild(nodeText);
                    p.appendChild(timeDate);
                    p.appendChild(userName);
                    p.appendChild(paraText);
                    p.appendChild(deleteMessage);
                    li.appendChild(p);
                    commitList2.prepend(li);
                    deleteMessage.addEventListener("click", () => {
                      delMessage2(docmt.id, sDocs.id, p);
                    });

                    let editBtn = document.createElement("button");
                    editBtn.classList.add("editBtn");
                    editBtn.innerText = "Edit";
                    p.appendChild(editBtn);
                    // console.log(editBtn);
                    let insertedText = document.createTextNode(
                      paraText.innerText
                    );
                    let input2 = document.createElement("input");
                    input2.classList.add("editInput");
                    input2.type = "input";
                    input2.appendChild(insertedText);
                    input2.value = input2.innerText;
                    let send = document.createElement("button");
                    send.classList.add("commit-btn2");
                    send.innerText = "send";
                    p.appendChild(input2);
                    p.appendChild(send);
                    input2.style.display = "none";
                    send.style.display = "none";
                    editBtn.addEventListener("click", () => {
                      input2.value = paraText.innerText;
                      input2.style.display = "inline";
                      send.style.display = "inline";
                      paraText.style.display = "none";
                      editBtn.style.display = "none";
                    });
                    send.addEventListener("click", async () => {
                      let time = new Date();
                      paraText.innerText = input2.value;
                      timeDate.innerText = Timing(time);
                      input2.style.display = "none";
                      send.style.display = "none";
                      paraText.style.display = "inline";
                      editBtn.style.display = "inline";
                      const updateData = doc(
                        db,
                        "dualchat",
                        `${docmt.id}`,
                        "subCollection",
                        `${sDocs.id}`
                      );
                      await updateDoc(updateData, {
                        currentTime: timeDate.innerText,
                        name: user.displayName,
                        message1: paraText.innerText,
                      });
                      childContainer.appendChild(commitList2);
                      input3.value = "";
                    });
                  }
                });
              }

              subSend.addEventListener("click", async () => {
                let time = new Date();
                let dataTrack = Math.round(time.getTime() / 1000);

                console.log("The dataTrack number is :", dataTrack);
                var abc3 = await addDoc(
                  collection(db, "dualchat", `${docmt.id}`, "subCollection"),
                  {
                    docTrack: dataTrack,
                    currentTime: Timing(time),
                    name: user.displayName,
                    message1: input3.value,
                  }
                );
                if (input3.value != "") {
                  let li = document.createElement("li");
                  li.classList.add("list-Item");
                  let p = document.createElement("p");
                  let timeDate = document.createElement("span");
                  timeDate.classList.add("current-time2");
                  timeDate.innerText = Timing(time);
                  let userName = document.createElement("span");
                  userName.classList.add("user-name");
                  let userNode = document.createTextNode(user.displayName);
                  userName.appendChild(userNode);
                  let paraText = document.createElement("span");
                  paraText.classList.add("para-text");
                  let deleteMessage = document.createElement("button");
                  deleteMessage.classList.add("deleteBtn");
                  let delNodeText = document.createTextNode("X");
                  deleteMessage.appendChild(delNodeText);
                  p.classList.add("commit-text");
                  p.classList.add("commit-text2");
                  let nodeText = document.createTextNode(input3.value);
                  paraText.appendChild(nodeText);
                  p.appendChild(timeDate);
                  p.appendChild(userName);
                  p.appendChild(paraText);
                  p.appendChild(deleteMessage);
                  li.appendChild(p);
                  commitList2.prepend(li);
                  deleteMessage.addEventListener("click", () => {
                    delMessage2(docmt.id, abc3.id, p);
                  });

                  /************************ lets try update section ***************************/
                  let editBtn = document.createElement("button");
                  editBtn.classList.add("editBtn");
                  editBtn.innerText = "Edit";
                  p.appendChild(editBtn);
                  // console.log(editBtn);
                  let insertedText = document.createTextNode(
                    paraText.innerText
                  );
                  let input2 = document.createElement("input");
                  input2.classList.add("editInput");
                  input2.type = "input";
                  input2.appendChild(insertedText);
                  input2.value = input2.innerText;
                  let send = document.createElement("button");
                  send.classList.add("commit-btn2");
                  send.innerText = "send";
                  p.appendChild(input2);
                  p.appendChild(send);
                  input2.style.display = "none";
                  send.style.display = "none";
                  editBtn.addEventListener("click", () => {
                    input2.value = paraText.innerText;
                    input2.style.display = "inline";
                    send.style.display = "inline";
                    paraText.style.display = "none";
                    editBtn.style.display = "none";
                  });
                  send.addEventListener("click", async () => {
                    let time = new Date();
                    paraText.innerText = input2.value;
                    timeDate.innerText = Timing(time);
                    input2.style.display = "none";
                    send.style.display = "none";
                    paraText.style.display = "inline";
                    editBtn.style.display = "inline";
                    const updateData = doc(
                      db,
                      "dualchat",
                      `${docmt.id}`,
                      "subCollection",
                      `${abc3.id}`
                    );
                    await updateDoc(updateData, {
                      currentTime: timeDate.innerText,
                      name: user.displayName,
                      message1: paraText.innerText,
                    });
                    childContainer.appendChild(commitList2);
                  });
                  input3.value = "";
                } else {
                  alert("You didn't enter any value in the box");
                }
              });
            }
            childContainer.classList.toggle("child-container-toggle");
          });
        }
        // console.log(doc.id, " => ", doc.data());
      });
    }
  } else {
    h2.innerText = "yet no user logged in";
  }
});

let signInPopup = document.querySelector(".signInPopup");
let signInDiv = document.querySelector(".container1");
let signUpPopup = document.querySelector(".signUpPopup");
let signUpDiv = document.querySelector(".container2");
let logOut = document.querySelector("signOut");

signInPopup.addEventListener("click", () => {
  signInDiv.classList.toggle("container1-toggle");
});
signUpPopup.addEventListener("click", () => {
  signUpDiv.classList.toggle("container2-toggle");
});

/*************************************** app message section***************************** */
// console.log("everthing is ok");
