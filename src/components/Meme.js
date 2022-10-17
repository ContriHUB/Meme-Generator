import React from "react";
import { useState, useEffect } from "react";

export default function Meme() {
	const api_url = "https://api.imgflip.com/get_memes";
	const R2D = 180 / Math.PI;
	//this is to store all the meme's url returned by the api
	const [allMemes, setAllMemes] = useState([]);
	const [textInput, setTextInput] = useState("");
	const [currRot, setCurrRot] = useState(null);
	const [rotStartAngle, setRotStartAngle] = useState(0);
	const [currRotAngle, setCurrRotAngle] = useState(0);

	//this function run only once on component load
	//when this component is mounted on page
	//it makes call to the api
	//and store the response in the state
	useEffect(function () {
		fetch(api_url)
			.then((data) => data.json())
			.then((data) => setAllMemes(data.data.memes))
			.catch((err) =>
				document.write(
					"<center> <h3>Engine can't understand this code , it's invalid. please check code and reload page </h3> </center> "
				)
			);
	}, []);

	//this state stores information about the current meme
	const [meme, setMeme] = useState({
		texts: [],
		url: "",
	});

	function getRandomMeme() {
		let index = Math.floor(Math.random() * allMemes.length);
		setMeme((prev) => ({
			...prev,
			url: allMemes[index].url,
		}));
	}

	//this is for handling the reset functionality
	const handleDelete = (i) => {
		setMeme((prev) => ({
			...prev,
			texts: prev.texts.filter((_, index) => index !== i),
		}));
	};

	//this is to handle input change
	function handleChange(event) {
		const { value } = event.target;

		setTextInput(value);
	}
	function handleTextSubmit(event) {
		event.preventDefault();
		if (textInput.length === 0) {
			return;
		}
		//set the texts of the meme
		const temp = meme.texts;
		temp.push({
			text: textInput,
			style: {
				left: "",
				top: `${temp.length * 30}px`,
				webkitTransform: "rotate(0deg)",
			},
			currAngle: 0,
		});
		setMeme((prev) => ({
			...prev,
			texts: temp,
		}));
		setTextInput("");
	}
	//this is for handling the reset functionality
	function handleReset() {
		setMeme({
			texts: [],
			url: "",
		});
	}

	// this is for uploading the image from the PC
	function uploadImage(event) {
		let fileURL = event.target.files[0];
		console.log(event.target.files[0].type);
		// accepts image in the form of PNG/JPG/JPEG
		if (
			event.target.files[0].type === "image/png" ||
			event.target.files[0].type === "image/jpg" ||
			event.target.files[0].type === "image/jpeg"
		) {
			setMeme((prev) => ({
				...prev,
				url: URL.createObjectURL(fileURL),
			}));
			event.target.value = null;
		} else {
			// Alert is shown when there is incorrect file chosen
			alert(
				"Please upload the image in the correct format (PNG/JPEG/JPG)!"
			);
		}
	}

	const memeTexts = meme.texts.map(
		(t, i) =>
			meme.url && (
				<h2
					className="meme__text absolute"
					key={i}
					id={i}
					draggable
					onDragStart={(e) => handleDragStart(e, i)}
					style={t.style}
				>
					{t.text}
					<div
						className="meme__text__close"
						onClick={() => handleDelete(i)}
					>
						&#x2715;
					</div>
					<div
						className="meme__text__rotate"
						onMouseDown={(e) => startRot(e, i)}
					>
						&nbsp;
					</div>
				</h2>
			)
	);

	//these will be used to calculate the position of the texts while dragging
	var p1 = 0,
		p2 = 0,
		p3 = 0,
		p4 = 0;

	//when the text starts to drag
	const handleDragStart = (e, id) => {
		p3 = e.clientX; //left and right distance of the cursor when we start dragging
		p4 = e.clientY;
		e.dataTransfer.setData("id", id);
	};

	//when the text is dragged over the meme image
	const handleDragOver = (e) => {
		e.preventDefault();
	};

	//when the text is dropped on the meme image
	const handleDrop = (e) => {
		e.preventDefault();
		//get the id that we set during dragstart
		const id = Number(e.dataTransfer.getData("id"));
		//relative chane in the mouse position when we drop the text
		p1 = p3 - e.clientX;
		p2 = p4 - e.clientY;

		//create a temp text array to make changes in the style and then set it to original state
		const tempTexts = meme.texts;
		//change the style of selected text and position it on the cursor
		tempTexts[id].style = {
			...tempTexts[id].style,
			//distance of the dropped text should be equal to the difference between cursor's position
			//when it started drag and when it dropped. and subtract the offset of the element from it.
			left: `${document.getElementById(String(id)).offsetLeft - p1}px`,
			//similarly calculate top.
			top: `${document.getElementById(id).offsetTop - p2}px`,
		};
		//set the temp texts to real texts in the meme state
		setMeme((prev) => ({
			...prev,
			texts: tempTexts,
		}));
	};

	const startRot = (e, id) => {
		e.preventDefault();

		setCurrRot(id);

		const currRotEl = document.getElementById(id);

		const bb = currRotEl.getBoundingClientRect(),
			t = bb.top,
			l = bb.left,
			h = bb.height,
			w = bb.width;

		const centerX = l + w / 2,
			centerY = t + h / 2;
		setRotStartAngle(R2D * Math.atan2(e.clientY - centerY, e.clientX - centerX));
	};

	const textRot = e => {
		if (currRot != null)
		{
			e.preventDefault();

			const currRotEl = document.getElementById(currRot);

			const bb = currRotEl.getBoundingClientRect(),
				t = bb.top,
				l = bb.left,
				h = bb.height,
				w = bb.width;

			const centerX = l + w / 2,
				centerY = t + h / 2;

			const rotation = R2D * Math.atan2(e.clientY - centerY, e.clientX - centerX) - rotStartAngle;
			setCurrRotAngle(rotation);

			const tempTexts = meme.texts;
			tempTexts[currRot].style = {
				...tempTexts[currRot].style,
				webkitTransform: `rotate(${tempTexts[currRot].currAngle + rotation}deg)`
			};
			setMeme((prev) => ({
				...prev,
				texts: tempTexts,
			}));
		}
	};

	const stopRot = (e) => {
		e.preventDefault();

		const tempTexts = meme.texts;
		tempTexts[currRot].currAngle += currRotAngle;
		setMeme((prev) => ({
			...prev,
			texts: tempTexts,
		}));

		setCurrRot(null);
	};

	return (
		<div className="container">
			<form className="form" onSubmit={handleTextSubmit}>
				<input
					className="form__text"
					type="text"
					value={textInput}
					placeholder="text2"
					name="bottomText"
					onChange={handleChange}
				/>
				<button type="submit" className="form__submit__button">
					Add Text
				</button>
				<button className="form__button" onClick={getRandomMeme}>
					Generate Meme
				</button>
				<label
					htmlFor="image-upload"
					className="form__button upload_image__button"
				>
					Upload Meme Image
				</label>
				<input
					accept="image/*"
					id="image-upload"
					type="file"
					onChange={uploadImage}
				/>
				<button className="form__button" onClick={handleReset}>
					Reset Meme
				</button>
			</form>
			<div className="meme">
				{meme.url && (
					<img
						className="meme__image"
						src={meme.url}
						alt="meme"
						onDragOver={(e) => handleDragOver(e)}
						onDrop={(e) => handleDrop(e)}
						onMouseMove={e => textRot(e)}
						onMouseUp={e => stopRot(e)}
					/>
				)}
				{memeTexts}
			</div>
		</div>
	);
}
