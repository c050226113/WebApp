<html>
<script>
    var wsServer = 'ws://192.168.1.6:9000';
    var webSocket = new WebSocket(wsServer);

    webSocket.onopen = function(evt){
        console.log("Connected to webSocket server.");
        webSocket.send('{"cmd":ls,"is_block":1}');
    };
    webSocket.onclose = function(evt) {
        console.log("Disconnected");
    };
    webSocket.onmessage = function(evt){
        console.log('Retrieved data from server : ' + evt.data);
    };
    webSocket.onerror = function(evt, e){
        console.log('Error occured: ' + evt.data);
    }
</script>
</html>