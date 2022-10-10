import React from "react";
import { useState, useEffect } from "react";

export default function Meme() {
	const api_url = "https://api.imgflip.com/get_memes";
	//this is to store all the meme's url returned by the api
	const [allMemes, setAllMemes] = useState([]);

	//this function run only once on component load
	//when this component is mounted on page
	//it makes call to the api
	//and store the response in the state
	useEffect(function () {
		fetch(api_url)
			.then((data) => data.json())
			.then((data) => setAllMemes(data.data.memes));
	}, []);

	//this state stores information about the current meme
	const [meme, setMeme] = useState({
		topText: "",
		bottomText: "",
		url: "",
	});
	
	//data for all the input texts that are supposed to be draggable
	const [memeTextData, setMemeTextData] = useState(
		[
			{
				id: "1",
				style: {
					left: "",
					top: "0px",
				}
			},
			{
				id: "2",
				style: {
					left: "",
					top: "",
					bottom: "0px"	
				}
			}
		]
	)

	function getRandomMeme() {
		let index = Math.floor(Math.random() * allMemes.length);
		setMeme((prev) => ({
			...prev,
			url: allMemes[index].url,
		}));
	}

	//this is for handling the reset functionality
	function handleReset() {
		setMeme({
			topText: "",
			bottomText: "",
			url: ""
		});
	}

	//this is to handle input change
	function handleInputChange(event) {
		const {name, value} = event.target;
		setMeme( (prevMeme) => ({
			...prevMeme,
			[name]: value
		}) );
	}
	
	// this is for uploading the image from the PC
	function uploadImage(event){
		let fileURL = event.target.files[0];
		console.log(event.target.files[0].type);
		// accepts image in the form of PNG/JPG/JPEG
		if (event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpg" || event.target.files[0].type === "image/jpeg"){
			setMeme((prev) => ({
				...prev,
				url: URL.createObjectURL(fileURL)
			}))
			event.target.value = null;
		}
		else{
			// Alert is shown when there is incorrect file chosen
			alert("Please upload the image in the correct format (PNG/JPEG/JPG)!")
		}
	}

	
	//redering the text data in h2 tag 
	const memeTexts = memeTextData.map(text => {
		return <h2
				key={text.id}
				id={text.id}
				draggable
				onDragStart={(e)=>handleDragStart(e, text.id)} 
				style={text.style}
				className="meme__text"
			> 
				{text.id === "1" ? meme.topText : meme.bottomText} 
			</h2>
	})
	
	//these will be used to calculate the position of the texts while dragging
	var p1 = 0, p2 = 0, p3 = 0, p4 = 0;
	
	//when the text starts to drag 
	const handleDragStart = (e, id) => {
		p3 = e.clientX; //left and right distance of the cursor when we start dragging
		p4 = e.clientY;
		e.dataTransfer.setData("id",id);
	}

	//when the text is dragged over the meme image
	const handleDragOver = (e) => {
		e.preventDefault();
	}

	//when the text is dropped on the meme image
	const handleDrop = (e) => {
		e.preventDefault();
		//get the id that we set during dragstart
		const id = e.dataTransfer.getData("id");
		//relative chane in the mouse position when we drop the text
		p1 = p3 - e.clientX;
		p2 = p4 - e.clientY;

		//create a temp text array to make changes in the style and then set it to original state
		const tempTexts = [...memeTextData]
		//change the style of selected text and position it on the cursor
		let index = tempTexts.findIndex((text) => text.id === id);
		if(index === -1) return;
		tempTexts[index].style = {
			//distance of the dropped text should be equal to the difference between cursor's position 
			//when it started drag and when it dropped. and subtract the offset of the element from it.
			left: `${document.getElementById(id).offsetLeft - p1}px`,
			//similarly calculate top.
			top: `${document.getElementById(id).offsetTop - p2}px`,
		}
		//set the temp texts to real texts
		setMemeTextData(tempTexts)
	}

	return (
		<div className="container">
			<div className="form">
				<input
					className="form__text"
					type="text"
					value={meme.topText}
					placeholder="text1"
					name="topText"
					onChange={handleInputChange}
					/>
				<input
					className="form__text"
					type="text"
					value={meme.bottomText}
					placeholder="text2"
					name="bottomText"
					onChange={handleInputChange}
				/>
				<button className="form__button" onClick={getRandomMeme}>
					Generate Meme
				</button>
				<label htmlFor="image-upload" className="form__button upload_image__button">
					Upload Meme Image
				</label>
				<input accept="image/*" id="image-upload" type="file" onChange={uploadImage} />
				<button className="form__button" onClick={handleReset}>
					Reset Meme
				</button>
			</div>
			<div className="meme">
				{	
					meme.url && 
					<img 
						className="meme__image" 
						src={meme.url} alt="meme"
						onDragOver={(e)=>handleDragOver(e)}
						onDrop={(e) => handleDrop(e)}
					/>
				}
				{memeTexts}
			</div>
		</div>
	);
}
