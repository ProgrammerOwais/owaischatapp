import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
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
let reloadPage = document.querySelector(".fresh");
reloadPage.addEventListener("click", () => {
  let commitList = document.querySelector(".commit-list");
  while (commitList.firstChild) {
    commitList.firstChild.remove();
  }
  userData();
});
/******************************************* INTRO SECTION *******************/
let main = document.querySelector("main");
let header = document.querySelector("header");
let introDiv = document.querySelector(".intro-div");
main.style.display = "none";
header.style.display = "none";
let intro = document.querySelector(".intro");
intro.innerText = "Welcome to BSCS2-M1 IT Topics";
intro.innerHTML = intro.textContent.replace(
  /\S/g,
  "<span class = 'intro-char'>$&</span>"
);
let intros = document.querySelectorAll(".intro-char");
let i = 0;
let timeline = setInterval(() => {
  intros[i].classList.add("intro-char2");
  i++;
  if (i > 24) {
    clearInterval(timeline);
    setTimeout(() => {
      main.style.display = "block";
      header.style.display = "block";
      introDiv.style.display = "none";
    }, 1000);
  }
}, 100);
/************************************************ Header section */

let signInPopup = document.querySelector(".signInPopup");
let signInDiv = document.querySelector(".container1");
let signUpPopup = document.querySelector(".signUpPopup");
let signUpDiv = document.querySelector(".container2");
let closeSignIn = document.querySelector(".closeSignIn");
let closeSignUp = document.querySelector(".closeSignUp");
// console.log(" really 32");
let hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("clicked");
});
closeSignIn.addEventListener("click", () => {
  // console.log("it works");
  signInDiv.classList.toggle("container1-toggle");
});
closeSignUp.addEventListener("click", () => {
  signUpDiv.classList.toggle("container2-toggle");
});

signInPopup.addEventListener("click", () => {
  signInDiv.classList.toggle("container1-toggle");
  hamburger.classList.toggle("clicked");
});
signUpPopup.addEventListener("click", () => {
  signUpDiv.classList.toggle("container2-toggle");
  hamburger.classList.toggle("clicked");
});

let projects = document.querySelector(".project-div");
projects.addEventListener("click", () => {
  projects.classList.toggle("sub-projects");
});

/*************************************************** SignIn/SignUp With Email & Password************/

function SignUpEP(e) {
  // console.log("Your function is called");
  e.preventDefault();

  let email = document.querySelector(".signUpEmail");
  let password = document.querySelector(".signUpPassword");
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(user);
      alert(
        "Your account is successfully created , now you can use this email/password for signing in again thanks"
      );
      signUpDiv.classList.toggle("container2-toggle");
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert(errorMessage);
      console.log("the errors is : ", errorMessage);
      console.log("The code error is : ", errorCode);
      // ..
    });

  email.value = "";
  password.value = "";
}
function SignInEP(e) {
  e.preventDefault();
  let email = document.querySelector(".signInEmail");
  let password = document.querySelector(".signInPassword");
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("Thankyou for signingIn");
      signInDiv.classList.toggle("container1-toggle");
      setTimeout(() => {
        window.location.reload(true);
      }, 2000); // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // alert("Email or password is invalid try again");
      alert(errorMessage);
      email.value = "";
      password.value = "";
    });
  email.value = "";
  password.value = "";
}
let signUpBtn = document.querySelector(".signUpBtn");
signUpBtn.addEventListener("click", SignUpEP);
let signInBtn = document.querySelector(".signInBtn");
signInBtn.addEventListener("click", SignInEP);

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
      alert("Thankyou for signingIn");

      signInDiv.classList.toggle("container1-toggle");
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
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
      alert(
        "We have some problem to signingIn you with google , plz try to check your google account security."
      );
    });
});
let logOut = document.querySelector(".signOut");
logOut.style.display = "none";
logOut.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("You successfully logout");
      let commitList = document.querySelector(".commit-list");
      while (commitList.firstChild) {
        commitList.firstChild.remove();
      }
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    })
    .catch((error) => {
      console.log("Error in logging out ", error);
    });
});
let confirmation = document.querySelector(".confirmation");
const db = getFirestore();

/************** Time Converting Function  *****************/
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
/************ Automatically checking wether user is logged in or not from cloud firestore */
function userData() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // console.log("the functio is first time exectued");
      logOut.style.display = "inline";
      signInPopup.style.display = "none";
      signUpPopup.style.display = "none";
      confirmation.innerText = "You are successfully logged in";
      setTimeout(() => {
        confirmation.style.display = "none";
      }, 3000);
      confirmation.style.color = "green";
      let inputText = document.querySelector(".user-text");
      let commitBtn = document.querySelector(".commit-btn");
      let commitList = document.querySelector(".commit-list");
      commitBtn.addEventListener("click", () => {
        displayMessage();
      });

      async function displayMessage() {
        if (inputText.value != "") {
          let time = new Date();

          let li = document.createElement("li");
          li.classList.add("list-Item");
          let p = document.createElement("p");
          let timeDate = document.createElement("span");
          timeDate.classList.add("current-time");
          timeDate.innerText = Timing(time);
          // console.log("the time is : ", timeDate);
          let userName = document.createElement("span");
          userName.classList.add("user-name");
          let userNode = document.createTextNode(user.displayName);
          userName.appendChild(userNode);
          if (
            user.email == "owaistag@gmail.com" ||
            user.email == "owaisxeon@gmail.com" ||
            user.email == "muhammadowaiskhan616@gmail.com"
          ) {
            userName.style.color = "green";
          }
          let paraText = document.createElement("span");
          paraText.classList.add("para-text");
          let deleteMessage = document.createElement("button");
          deleteMessage.classList.add("deleteBtn");
          let delNodeText = document.createTextNode("X");
          deleteMessage.appendChild(delNodeText);
          p.classList.add("commit-text");
          let nodeText = document.createTextNode(inputText.value);
          paraText.appendChild(nodeText);
          p.style.backgroundColor = "rgb(135, 173, 243)";
          p.appendChild(timeDate);
          p.appendChild(userName);
          p.appendChild(paraText);
          p.appendChild(deleteMessage);
          li.appendChild(p);
          commitList.prepend(li);
          inputText.value = "";

          /************************ update section *********************/
          let editBtn = document.createElement("button");
          editBtn.classList.add("editBtn");
          editBtn.innerText = "Edit";
          p.appendChild(editBtn);
          // console.log(editBtn);
          let insertedText = document.createTextNode(paraText.innerText);
          let input2 = document.createElement("input");
          input2.classList.add("editInput");
          input2.type = "text";
          input2.appendChild(insertedText);
          input2.value = input2.innerText;
          let send = document.createElement("button");
          send.classList.add("commit-btn2");
          send.innerText = "send";
          p.appendChild(input2);
          p.appendChild(send);
          input2.style.display = "none";
          send.style.display = "none";
          /*************************** STORING DATA IN DATABASE ******/
          let dataTrack = Math.round(time.getTime() / 1000);
          // console.log("The dataTrack number is :", dataTrack);
          var abc = await addDoc(collection(db, "chatting"), {
            docTrack: dataTrack,
            currentTime: Timing(time),
            userEmail: user.email,
            name: user.displayName,
            message1: paraText.innerText,
          });

          /*************************** EVENTS IN APP */

          deleteMessage.addEventListener("click", () => {
            delMessage(abc.id, p);
          });
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
            const updateData = doc(db, "chatting", `${abc.id}`);
            await updateDoc(updateData, {
              currentTime: timeDate.innerText,
              name: user.displayName,
              message1: paraText.innerText,
            });
          });

          /******************************* Reply section ***************/
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
              // console.log("it add the div");
              li.appendChild(childContainer);
              let input3 = document.createElement("input");
              input3.type = "text";
              input3.classList.add("input3");
              let subSend = document.createElement("button");
              subSend.innerText = "send";
              subSend.classList.add("subSend");
              let hideContainer = document.createElement("span");
              hideContainer.innerText = "X";
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
                // console.log("the function is executed");
                let time = new Date();

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
                  p.style.backgroundColor = "rgb(135, 173, 243)";
                  p.appendChild(timeDate);
                  p.appendChild(userName);
                  p.appendChild(paraText);
                  p.appendChild(deleteMessage);
                  li.appendChild(p);
                  commitList2.prepend(li);
                  input3.value = "";

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
                  /*********************************** STORING SUB-DATA IN DATABASE *********/
                  let dataTrack = Math.round(time.getTime() / 1000);
                  // console.log("The dataTrack number is :", dataTrack);
                  var abc2 = await addDoc(
                    collection(db, "chatting", `${abc.id}`, "subCollection"),
                    {
                      docTrack: dataTrack,
                      currentTime: Timing(time),
                      userEmail: user.email,
                      name: user.displayName,
                      message1: paraText.innerText,
                    }
                  );

                  /*********************************** SUB EVENTS IN THE APP *********/

                  deleteMessage.addEventListener("click", () => {
                    delSubMessage2(abc.id, abc2.id, p);
                  });
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
                      "chatting",
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
                } else {
                  alert("You didn't enter any value in the box");
                }
              }
            }

            childContainer.classList.toggle("child-container-toggle");
            // console.log("coninued");
          });
        }
        // else {
        //   alert(" You didn't commit anything");
        // }
      }
      /******** delete user own main message */
      async function delMessage(deldocs, p) {
        p.remove();
        await deleteDoc(doc(db, "chatting", `${deldocs}`));
      }
      /******** delete user own sub/reply message message */
      async function delSubMessage2(parentDoc, subDoc, p) {
        p.remove();
        await deleteDoc(
          doc(db, "chatting", `${parentDoc}`, "subCollection", `${subDoc}`)
        );
      }
      /***************************** Get user messages/docs/info from Firebase ******************/
      const querySnapshot = await getDocs(collection(db, "chatting"));
      let docArray = [];
      let track = 0;
      querySnapshot.forEach((trackDocs) => {
        //store the data in array
        docArray[track] = parseInt(trackDocs.data().docTrack);
        track += 1;
      });
      docArray.sort((a, b) => a - b); // arrange the docs in a sequence in an array
      for (let i = 1; i <= querySnapshot._snapshot.docChanges.length; i++) {
        querySnapshot.forEach(async (docmt) => {
          //only sequence docs will execute in "if".
          if (docArray[i - 1] == docmt.data().docTrack) {
            // console.log("document data info is : ", docmt);
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
            if (
              docmt.data().userEmail == "owaistag@gmail.com" ||
              docmt.data().userEmail == "owaisxeon@gmail.com" ||
              docmt.data().userEmail == "muhammadowaiskhan616@gmail.com"
            ) {
              userName.style.color = "green";
            }
            let paraText = document.createElement("span");
            paraText.classList.add("para-text");
            let deleteMessage = document.createElement("button");
            deleteMessage.classList.add("deleteBtn");
            let delNodeText = document.createTextNode("X");
            deleteMessage.appendChild(delNodeText);
            p.classList.add("commit-text");
            let nodeText = document.createTextNode(docmt.data().message1);
            paraText.appendChild(nodeText);
            if (docmt.data().name == user.displayName) {
              p.style.backgroundColor = "rgb(135, 173, 243)";
            }
            p.appendChild(timeDate);
            p.appendChild(userName);
            p.appendChild(paraText);
            p.appendChild(deleteMessage);
            li.appendChild(p);
            commitList.prepend(li);
            deleteMessage.addEventListener("click", async () => {
              if (user.email == docmt.data().userEmail) {
                p.remove();
                await deleteDoc(doc(db, "chatting", `${docmt.id}`));
              } else {
                alert(
                  "You don't have a permission to delete other users message"
                );
              }
            });
            /********** Update Section **********/
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
              if (user.email == docmt.data().userEmail) {
                input2.value = paraText.innerText;
                input2.style.display = "inline";
                send.style.display = "inline";
                paraText.style.display = "none";
                editBtn.style.display = "none";
              } else {
                alert(
                  "You don't have a permission to edit other users message"
                );
              }
            });
            send.addEventListener("click", async () => {
              let time = new Date();
              paraText.innerText = input2.value;
              input2.style.display = "none";
              send.style.display = "none";
              paraText.style.display = "inline";
              editBtn.style.display = "inline";
              const updateData2 = doc(db, "chatting", `${docmt.id}`);
              await updateDoc(updateData2, {
                currentTime: Timing(time),
                name: user.displayName,
                message1: paraText.innerText,
              });
            });

            /************************* Reply section ****************************/

            const subDocumnt = await getDocs(
              collection(db, "chatting", `${docmt.id}`, "subCollection")
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
              // console.log("reply works");
              if (
                li.lastElementChild.classList.contains("child-container") ==
                false
              ) {
                // console.log("it add the div");
                li.appendChild(childContainer);

                let input3 = document.createElement("input");
                input3.type = "text";
                input3.classList.add("input3");
                let subSend = document.createElement("button");
                subSend.innerText = "send";
                subSend.classList.add("subSend");
                let hideContainer = document.createElement("span");
                hideContainer.innerText = "X";
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
                // console.log(
                //   "The docs inside is : ",
                //   subDocumnt._snapshot.docChanges.length
                // );
                for (
                  let j = 1;
                  j <= subDocumnt._snapshot.docChanges.length;
                  j++
                ) {
                  subDocumnt.forEach((sDocs) => {
                    if (docArray[j - 1] == sDocs.data().docTrack) {
                      // console.log(
                      //   "The numbers is :",
                      //   sDocs.data().docTrack,
                      //   " and its value is ",
                      //   sDocs.data().message1
                      // );
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
                      if (
                        sDocs.data().userEmail == "owaistag@gmail.com" ||
                        sDocs.data().userEmail == "owaisxeon@gmail.com" ||
                        sDocs.data().userEmail ==
                          "muhammadowaiskhan616@gmail.com"
                      ) {
                        userName.style.color = "green";
                      }
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
                      if (sDocs.data().name == user.displayName) {
                        p.style.backgroundColor = "rgb(135, 173, 243)";
                      }
                      paraText.appendChild(nodeText);
                      p.appendChild(timeDate);
                      p.appendChild(userName);
                      p.appendChild(paraText);
                      p.appendChild(deleteMessage);
                      li.appendChild(p);
                      commitList2.prepend(li);
                      deleteMessage.addEventListener("click", async () => {
                        if (user.email == sDocs.data().userEmail) {
                          p.remove();
                          await deleteDoc(
                            doc(
                              db,
                              "chatting",
                              `${docmt.id}`,
                              "subCollection",
                              `${sDocs.id}`
                            )
                          );
                        } else {
                          alert(
                            "You don't have a permission to delete other users message"
                          );
                        }
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
                        if (user.email == sDocs.data().userEmail) {
                          input2.value = paraText.innerText;
                          input2.style.display = "inline";
                          send.style.display = "inline";
                          paraText.style.display = "none";
                          editBtn.style.display = "none";
                        } else {
                          alert(
                            "You don't have a permission to edit other users message"
                          );
                        }
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
                          "chatting",
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
                // Adding the new messages in reply section in previous get docs
                subSend.addEventListener("click", async () => {
                  let time = new Date();
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
                    p.style.backgroundColor = "rgb(135, 173, 243)";
                    p.appendChild(timeDate);
                    p.appendChild(userName);
                    p.appendChild(paraText);
                    p.appendChild(deleteMessage);
                    li.appendChild(p);
                    commitList2.prepend(li);
                    input3.value = "";

                    /***************** Update Section *******************/
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
                    /******* STORING SUB-DATA IN THE DATABASE ******/
                    let dataTrack = Math.round(time.getTime() / 1000);

                    // console.log("The dataTrack number is :", dataTrack);
                    var abc3 = await addDoc(
                      collection(
                        db,
                        "chatting",
                        `${docmt.id}`,
                        "subCollection"
                      ),
                      {
                        docTrack: dataTrack,
                        currentTime: Timing(time),
                        userEmail: user.email,
                        name: user.displayName,
                        message1: paraText.innerText,
                      }
                    );
                    /*********************** Sub Events in the APP ******/

                    deleteMessage.addEventListener("click", () => {
                      delSubMessage2(docmt.id, abc3.id, p);
                    });
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
                        "chatting",
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
      signInPopup.style.display = "inline";
      signUpPopup.style.display = "inline";
      let commitBtn = document.querySelector(".commit-btn");
      commitBtn.addEventListener("click", () => {
        alert("You will need to logIn in order to commit here");

        let inputText = document.querySelector(".user-text");
        inputText.value = "";
      });

      confirmation.innerText = "Yet no user logged in";
      confirmation.style.color = "rgb(236, 79, 79)";
    }
  });
}
userData();
