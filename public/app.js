// main.html
let lawInput = document.getElementById('law-input');
let sendButton = document.getElementById('law-submit');
// let storiesWrapper = document.getElementById('stories-wrapper'); 
let lawCount = 0; // contatore leggi — mettilo fuori da tutto, in cima al file

//when the user writes the law and presses send, show the message on the page.
if (lawInput && sendButton) {
    let socket = io();
    socket.on("history", (stories) => {
        console.log("history received");
        stories.forEach(sharedstory => {
            createStoryElement(sharedstory);
        })
    })

    socket.on('connect', function () {
        console.log("Connected to server!");
    });


    
// Auto-resize textarea where the user writes the story
    lawInput.addEventListener("input", () => {
        lawInput.style.height = "auto";
        lawInput.style.height = lawInput.scrollHeight + "px";
    });

    
    // receive messages from the server
    socket.on('msg', function (data) {
        console.log("Message received:", data);
        createStoryElement(data);
    });

    // send messages to the server
    //when the send button is pressed trigger a note 
    sendButton.addEventListener('click', async function () {
        console.log("but")
        if (Tone.context.state !== "running") {
            await Tone.start();
        }
        // //play a middle 'C' for the duration of an 8th note
        // synth.triggerAttackRelease("C4", "0,5n");

        console.log("Sending message...");

        let curStory = lawInput.value;

        if (curStory.trim() !== "") {
            let msgObj = {
                msg: curStory
            };
            socket.emit('msg', msgObj);

            lawInput.value = "";
            lawInput.style.height = "auto";
        } else {
            alert("Please write something before sending!");
        }
    });

    // send with enter 
    lawInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    

    function createStoryElement(data) {
        // let storyContainer = document.createElement("div");
        // storyContainer.className = 'story-item';

        // let msgEl = document.createElement('p');
        // msgEl.textContent = data.msg;

        // storyContainer.appendChild(msgEl);
        // storyContainer.style.position = 'absolute';

        // storiesWrapper.appendChild(storyContainer);
       
        lawCount++;

    // --- riquadro rosso (constitution-feed) ---
    let feed = document.getElementById('constitution-feed');
    if (feed) {
        let entry = document.createElement('div');
        entry.className = 'constitution-entry';

        let num = document.createElement('div');
        num.className = 'law-number';
        num.textContent = `ART. ${lawCount}`;

        let text = document.createElement('p');
        text.textContent = data.msg;

        entry.appendChild(num);
        entry.appendChild(text);
        feed.appendChild(entry);

        // scroll automatico all'ultimo elemento
        let panel = document.getElementById('constitution-panel');
        panel.scrollTop = panel.scrollHeight;
    }
    }
}

