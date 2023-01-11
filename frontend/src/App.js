import { useState, useEffect } from 'react'

import './App.css';
import './components/BookTile'
import './components/Searchbar'
import SearchBar from './components/Searchbar';

const API_URL = 'http://localhost:5000';

function App() {
	let pageNumber = 0;
	let isFuzzy = true;
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	const [booksRecommendationList, setBooksRecommendationList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => { }, booksRecommendationList);

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
					setBooksRecommendationList(data['suggested']);
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
		</>
	);
}


export default App;