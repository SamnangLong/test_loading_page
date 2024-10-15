var connection_status = false;
var client;

setTimeout(function() {
    ConnectToMQTT();
}, 2000);

function ConnectToMQTT() {
    const randomClientNumber = Math.floor(Math.random() * 1000) + 1;
    const clientID = 'user' + randomClientNumber; // Generate unique user name
    const host = 'blithesome-chiropractor.cloudmqtt.com';
    const port = 443;

    client = new Paho.MQTT.Client(host, Number(port), clientID);
    
    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client
    client.connect({
        onSuccess: onConnect,
        useSSL: true,
        userName: 'rwufzabs',
        password: 'kVZNw5Tuj6e5',
        mqttVersion: 4
    });
}

// Function to subscribe to both topics and handle messages
function onConnect() {
    console.log("onConnect:");
    connection_status = true;

    // Subscribe to the touch and info topics
    const topicTouch1 = 'touch1';
    client.subscribe(topicTouch1);

    const topicTouch2 = 'touch2';
    client.subscribe(topicTouch2);

    const topicTouch3 = 'touch3';
    client.subscribe(topicTouch3);

    // Subscribe to the touch and info topics
    const topicInfo1 = 'state_info1';
    client.subscribe(topicInfo1);

    const topicInfo2 = 'state_info2';
    client.subscribe(topicInfo2);
    
    const topicInfo3 = 'state_info3';
    client.subscribe(topicInfo3);

    console.log("Subscribed to topics: touch");
}

// Function to publish data to the 'touch' MQTT topic with retain option
function publishToMQTT_Touch1(message_touch, retain = false) {
    client.send('touch1', message_touch, 0, retain); // '0' is the QoS, 'retain' is the retain flag
}
function publishToMQTT_Touch2(message_touch, retain = false) {
    client.send('touch2', message_touch, 0, retain); // '0' is the QoS, 'retain' is the retain flag
}
function publishToMQTT_Touch3(message_touch, retain = false) {
    client.send('touch3', message_touch, 0, retain); // '0' is the QoS, 'retain' is the retain flag
}

// Function to publish data to the 'info' MQTT topic 
function publishToMQTT_Info1(message_info) {
    client.send('info1', message_info);
}
function publishToMQTT_Info2(message_info) {
    client.send('info2', message_info);
}
function publishToMQTT_Info3(message_info) {
    client.send('info3', message_info);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
        alert("MQTT Connection Lost");
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);

    // Split the message into parts, e.g., "Button_Name=1"
    const [button_info, device_id] = message.payloadString.split(',');
    const device_name = device_id ? device_id.split('=')[1] : ''; // Extract "user617" from "Device_Name=user617", ensure device_info exists 

    // Handle messages from the 'touch' topic (disable buttons)
    if (message.destinationName === 'touch1') {
        if (button_info === "Button_Name=1") {
            document.getElementById('button1').style.backgroundColor = 'gray';
            document.getElementById('button1').disabled = true;
        }   else if (button_info === "Button_Name=0") {
            document.getElementById('button1').style.backgroundColor = '';
            document.getElementById('button1').disabled = false;
        }
    } else if (message.destinationName === 'touch2') {
        if (button_info === "Button_Name=2") {
            document.getElementById('button2').style.backgroundColor = 'gray';
            document.getElementById('button2').disabled = true;
        }   else if (button_info === "Button_Name=0") {
            document.getElementById('button2').style.backgroundColor = '';
            document.getElementById('button2').disabled = false;
        }
    } else if (message.destinationName === 'touch3') {
        if (button_info === "Button_Name=3") {
            document.getElementById('button3').style.backgroundColor = 'gray';
            document.getElementById('button3').disabled = true;
        }   else if (button_info === "Button_Name=0") {
            document.getElementById('button3').style.backgroundColor = '';
            document.getElementById('button3').disabled = false;
        }
    }   
    
    if (message.destinationName === 'state_info1') {
        if (button_info === "Button_Name=1" && device_name === client.clientId) {
            // Change button state
            document.getElementById('button1').style.backgroundColor = 'green';
            console.log("Subscribed topics: info1");
    
            // Redirect to the specified link
            window.location.href = 'https://link.payway.com.kh/ABAPAYa7300236f';
    
        } else if (button_info === "Button_Name=1" && device_name === client.clientId) {
            // Reset button state if another condition is met
            document.getElementById('button1').style.backgroundColor = '';
        }
    }
      
    
    else if (message.destinationName === 'state_info2') {
        if (button_info === "Button_Name=2" && device_name === client.clientId) {
            document.getElementById('button2').style.backgroundColor = 'yellow';
            console.log("Subscribed topics: info2");
        }   else if (button_info === "Button_Name=2" && device_name === client.clientId) {
            document.getElementById('button2').style.backgroundColor = '';
        }
    }   
    
    else if (message.destinationName === 'state_info3') {
        if (button_info === "Button_Name=3" && device_name === client.clientId) {
            document.getElementById('button3').style.backgroundColor = 'red';
            console.log("Subscribed topics: info3");
        }   else if (button_info === "Button_Name=3" && device_name === client.clientId) {
            document.getElementById('button3').style.backgroundColor = '';
        }
    }
    
}





// Handle button clicks to control the action
function button1() {
    if (connection_status) {
        const message_touch = `Button_Name=1`; // Prepare the message format
        publishToMQTT_Touch1(message_touch, true); // Publish message to MQTT

        const message_info = `Button_Name=1,Device_Name=${client.clientId}`; // Prepare the message format
        publishToMQTT_Info1(message_info); // Publish message to MQTT

        // Change button state
        document.getElementById('button1').style.backgroundColor = 'gray';
        document.getElementById('button1').disabled = true;  
        
        // Show the loading overlay after a delay of 500ms
        setTimeout(function() {
            showLoadingOverlay();
        }, 500);
    } else {
        alert("MQTT not connected");
    }
};

// Function to show the loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('overlay');
    const cancelBtn = document.getElementById('cancelBtn');

    // Directly show the overlay
    overlay.style.display = 'flex';

    // Handle cancel button click to hide the overlay
    cancelBtn.addEventListener('click', () => {
        overlay.style.display = 'none'; // Hide the overlay when cancel is clicked
        // Optionally enable the button again or reset its state
        document.getElementById('button1').style.backgroundColor = '';
        document.getElementById('button1').disabled = false; 
    });
}


// Handle button clicks to control the action
function button2() {
    if (connection_status) {
        const message_touch = `Button_Name=2`; // Prepare the message format
        publishToMQTT_Touch2(message_touch, true); // Publish message to MQTT

        const message_info = `Button_Name=2,Device_Name=${client.clientId}`; // Prepare the message format
        publishToMQTT_Info2(message_info); // Publish message to MQTT

        document.getElementById('button2').style.backgroundColor = 'gray';
        document.getElementById('button2').disabled = true;        
    } else {
        alert("MQTT not connected");
    }
};

// Handle button clicks to control the action
function button3() {
    if (connection_status) {
        const message_touch = `Button_Name=3`; // Prepare the message format
        publishToMQTT_Touch3(message_touch, true); // Publish message to MQTT

        const message_info = `Button_Name=3,Device_Name=${client.clientId}`; // Prepare the message format
        publishToMQTT_Info3(message_info); // Publish message to MQTT

        document.getElementById('button3').style.backgroundColor = 'gray';
        document.getElementById('button3').disabled = true;        
    } else {
        alert("MQTT not connected");
    }
};

// Handle button clicks to control the action
function resetButton() {
    if (connection_status) {
        const message_reset1 = `Button_Name=0`; // Prepare the message format
        pub_resetbutton1(message_reset1, true); // Publish message to MQTT 

        const message_reset2 = `Button_Name=0`; 
        pub_resetbutton2(message_reset2, true);

        const message_reset3 = `Button_Name=0`; 
        pub_resetbutton3(message_reset3, true);
        
        
    } else {
        alert("MQTT not connected");
    }
};
// Function to publish data to the 'touch' MQTT topic with retain option
function  pub_resetbutton1(message_touch, retain = false) {
    client.send('touch1', message_touch, 0, retain); 
}
function  pub_resetbutton2(message_touch, retain = false) {
    client.send('touch2', message_touch, 0, retain); 
}
function  pub_resetbutton3(message_touch, retain = false) {
    client.send('touch3', message_touch, 0, retain); 
}




