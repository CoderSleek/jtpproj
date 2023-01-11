import { useState, useEffect } from 'react'

import './App.css';
import './components/BookTile'
import BookTile from './components/BookTile';
import './components/Searchbar'
import SearchBar from './components/Searchbar';

const API_URL = 'http://localhost:5000';

function App() {
	const [pageNumber, setPageNumber] = useState(0);
	const [isFuzzy, setIsFuzzy] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	// const [booksRecommendationList, setBooksRecommendationList] = useState([]);
	const booksRecommendationList = [];
	const [bookRecommEles, setBookRecommEles] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {createBookRecommEles()}, [booksRecommendationList, pageNumber]);

	function createBookRecommEles(){
		const tempArr = booksRecommendationList.slice(pageNumber * 5, pageNumber * 5 -1);
		
		setBookRecommEles(tempArr.map((bookObject) => {
			return <BookTile
					key={bookObject['_id']}
					title={bookObject.title}
					coverImg={bookObject.coverImg}
					rating={bookObject.rating}
					description={bookObject.description}
					genres={bookObject.genres}
				/>
		}));
	}

	function handleChange(event) {
		setSearchTerm(event.target.value);
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (!searchTerm) {
			setError('Search Field cannot be empty');
			return;
		}
		setError('');

		try {
			const response = await fetch(
				API_URL + '/findbook?' +
				new URLSearchParams({
					'title': searchTerm.trim(),
					'fuzzy': isFuzzy
				}).toString(),
				{
					method: 'GET'
				}
			);


			if (response.status === 200) {
				const data = await response.json();
				if (data) {
					booksRecommendationList = data['suggested'];
					console.log(booksRecommendationList);
				} else {
					console.log('nothing found');
				}
			} else {
				console.log('internal server error');
			}
		} catch { }
	}

	return (
		<>
			<SearchBar
				handleSubmit={handleSubmit}
				searchTerm={searchTerm}
				handleChange={handleChange} 
				error={error}
			/>
			{bookRecommEles}
		</>
	);
}


export default App;