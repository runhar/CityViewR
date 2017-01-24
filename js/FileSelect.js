function handleFileSelect(f) {
	//var files = evt.target.files;
	//f = files[0];
	var reader = new FileReader();
	
	reader.onload = (function(theFile) {
		return function(e) {
			JsonObj = JSON.parse(e.target.result);
			console.log(JsonObj);
			};
		})(f);
		
		reader.readAsText(f);
		}