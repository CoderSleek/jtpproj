/**
 * This file handles all the business logic and acts as a parent/root component to
 * all the other component, it manages all the various states and encompasses all other
 * components as well as handles all the business logic and code.
 * 
 * This project is build using reactJS library and runs on port 3000.
 * The project structure encompasses all the components and their stylesheets in the component folder
 */

import { useState, useEffect } from 'react'

import './App.css';

// import all the various components
import ToggleSlider from './components/ToggleSlider';
import BookTile from './components/BookTile';
import SearchComponent from './components/SearchComponent';
import PaginationButtons from './components/PaginationButtons';
import SelectComponent from './components/SelectComponent';

// API URL
import { API_URL } from './index.js';

// for basic styling
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * handles all the business logic of the webapp as well as manages various states.
 * root component of the webapp
 * @returns {JSX component}
 */
function App() {
	// state management for the page number of webpage to display various recommendations
	// type = Number(0 - 3)
	const [pageNumber, setPageNumber] = useState(0);

	// state management for bool flag determining whether fuzzy search is on or off
	// type = Boolean
	const [isFuzzy, setIsFuzzy] = useState(false);

	// state management to set the search term in  searchbox
	// type = String
	const [searchTerm, setSearchTerm] = useState('');
	
	// state management for showing errors if any
	//  type = String
	const [error, setError] = useState('');

	// state management for list of JSX elements determining which search elements to appear
	// is sliced array from booksRecommendationList
	// type = Array of JSX [length is <= 5]
	const [bookRecommEles, setBookRecommEles] = useState([]);

	// state management for array of books to recommend contains object data
	// type = Array of Objects [length <= 20]
	const [booksRecommendationList, setBooksRecommendationList] = useState([]);

	// state management for bool flag whether the search type is searchByGenre
	// used for conditional rendering of the search by genre component
	// type = Boolean
	const [searchByGenre, setSearchByGenre] = useState(false);

	// state management for array of jsx elements containing a Book tile
	// type = Array of JSX [length <= 5]
	const [bookSearchEles, setBookSearchEles] = useState([]);

	// state management for the first search element based on which recommendations are provided
	// used to perform matching of common attributes between recommendations and search result
	// type = Object
	const [firstSearchObject, setFirstRecommendationObject] = useState(null);


	/**
	 * Ran once when the webpage is loaded since the dependency array is empty
	 * to get a list of random recommendations from the API calls fetch using GET request
	 * recieves a json response in the form
	 * {
	 * 	'suggested' : Array [...]
	 * }
	 * 
	 * sets book Recommendation list using the state setter function which causes a
	 * page reload automatically
	 */
	useEffect(() => {
		fetch(
			API_URL + '/recommendrandom',
			{
				method: 'GET'
			}
			)
			.then(res => res.json())
			.then(listOfRecomm => {
				// set the booksRecommendationList array
				// no need to do any additional if else checks since any error
				// will be caught by the setErrorWrapper
				setBooksRecommendationList(listOfRecomm['suggested'])
			})
			// set error msg to display if any
			.catch(ele => setErrorWrapper('Trouble Connecting to the server'));
	}, []); //empty dependency array


	/**
	 * This function creates new elements to diplay whenever a new page is loaded
	 * via pagination or new bookRecommendations are found via a search
	 * it uses a helper function createBookRecommEles which creates jsx elements
	 * from data
	 */
	useEffect(() => {
		createBookRecommEles();
	}, [pageNumber, booksRecommendationList]);


	/**
	 * This function wraps the setError method to set state of error msg
	 * setError is never called directly, instead the wrapper ensure that all the
	 * other neccessary states are reset before displaying error message as to not cause
	 * any unncessary bugs
	 * @param {String} errorMsg the error message to diplay at top of the screen
	 */
	function setErrorWrapper(errorMsg) {
		setBookSearchEles([]);
		setBooksRecommendationList([]);
		setBookRecommEles([]);
		setPageNumber(0);
		setError(errorMsg);
	}

	/**
	 * This function creates an Array of JSX components of BookTile to display as search result
	 * from an array recieved as a parameter it also calls various set stae methods as needed.
	 * Maps over each element in data param to return its corresponding JSX component
	 * @param {Array} data Array of objects containing data for each book element
	 */
	function createFuzzySearchEles(data) {
		// set the first search result
		setFirstRecommendationObject(data['searched'][0]);
		// temp array containing jsx elements of BookTile component
		// also sets the type of object 'search' in this case
		const temp = data['searched'].map(bookObject => {
			return mapBookObjectToBookTile(bookObject, 'search');
		});
		setBookSearchEles(temp);
	}

	/**
	 * Similar to createFuzzySearchEles function creates JSX element 
	 * of type BookTile to display in search results, the difference is it
	 * only creates one JSX element compared to createFuzzySearchEles
	 * This one element is then stored in an array of size 1 to maintain
	 * compatibility with createFuzzySearchEles. Sets type of element to search
	 * in booktile
	 * @param {Object} data Object containing data of single book
	 */
	function createExactSearchEles(data) {
		// set the first search result
		setFirstRecommendationObject(data['searched']);
		setBookSearchEles([mapBookObjectToBookTile(data['searched'], 'search')]);
	}

	/**
	 * Creates booksRecommendationEles which is an array of JSX elements
	 * from booksRecommendationList which contains object data of each book.
	 * 5 elements are sliced depending upon the page number in the viewport. 
	 */
	function createBookRecommEles() {
		// cannot create elements if no recommendations
		if (!booksRecommendationList.length) {
			return;
		}

		// 5 elements are sliced
		const tempArr = booksRecommendationList.slice(pageNumber * 5, (pageNumber + 1) * 5);
		// set state if book recomm eles with type recommendation
		setBookRecommEles(tempArr.map(bookObject => {
			return mapBookObjectToBookTile(bookObject, 'recommendation');
		}));
	}

	/**
	 * Updates the state of the search value based on whats being input in the search box
	 * @param {Event} event event object passed by the browser
	 */
	function handleSearchTermChange(event) {
		setSearchTerm(event.target.value);
	}

	/**
	 * This function retrieves search results and recommendations from the API
	 * when search button is clicked in the webpage.
	 * @param {Event} event event object passed by the browser
	 */
	async function handleSubmit(event) {
		// prevent default action of a form
		event.preventDefault();

		// if search box is empty when search button is clicked
		if (!searchTerm.trim()) {
			setErrorWrapper('Search Field cannot be empty');
			return;
		}

		// reset error if value searched
		setError('');

		// backend expects 2 query params title of the movie searched and whether fuzzy searching is on
		// is_fuzzy is set by the blue slider in webpage
		try {
			const response = await fetch(
				API_URL + '/recommendbysearch?' +
				new URLSearchParams({
					'title': searchTerm.trim(),
					'is_fuzzy': isFuzzy
				}).toString(),
				{
					method: 'GET'
				}
			);

			if (response.status === 200) {
				const data = await response.json();

				if (data) {
					setBooksRecommendationList(data['suggested']);
					// if fuzzy is true then list of search data is returned if fuzzy is false
					// only 1 data is returned
					isFuzzy ? createFuzzySearchEles(data) : createExactSearchEles(data);
				} else {
					// set error if response is None
					setErrorWrapper('No recommendation found');
				}
			} else {
				// some error in backend
				setErrorWrapper('Bad response');
			}
		} catch (err) { setErrorWrapper('Connectivity issue') }
	}

	/**
	 * This function returns a JSX correspondant of a book object
	 * it passes the data to BookTile Component, also sets the type
	 * of BookTile ['search', 'recommendation' or 'genre']
	 * @param {Object} bookObject 
	 * @param {string} type 
	 * @returns {JSX component}
	 */
	function mapBookObjectToBookTile(bookObject, type) {
		return <BookTile
			key={bookObject['_id']}
			bookObject={bookObject}
			type={type}
			// firstSearchObject helps to find the similarity between search result and recommendations
			firstSearchObject={firstSearchObject}
		/>
	}

	return (
		<>
			<SearchComponent
				handleSubmit={handleSubmit}
				searchTerm={searchTerm}
				handleChange={handleSearchTermChange}
				error={error}
				searchByGenreHandler={setSearchByGenre}
			/>
			<ToggleSlider
				handleToggle={setIsFuzzy}
				toggleStaus={isFuzzy}
			/>
			{ // conditional rendering of search by genre box
				searchByGenre &&
					<SelectComponent
						setErrorHandler={setErrorWrapper}
						setBookSearchEles={setBookSearchEles}
						setRecommBookHandler={setBooksRecommendationList}
						mapBookObjectToBookTile={mapBookObjectToBookTile}
						setBookRecommEles={setBookRecommEles}
					/>
			}
			{ // render search results if bookSearchEles array not empty
				bookSearchEles.length > 0 &&
				<div className='search--book-box'>
					<h2 className='book--box-title'>Search Results</h2>
					<div className="search--list">
						{bookSearchEles}
					</div>
				</div>
			}
			{
				booksRecommendationList.length > 0 &&
				<div className='recommend--book-box'>
					{ // condtional rendering whether the recommendations are randomised or based on a search
						bookSearchEles.length === 0 ? 
						<h2 className='book--box-title'>For you</h2> :
						<h2 className='book--box-title'>Similar to what you like</h2>
					}
					<div className="recommendation--list">
						{bookRecommEles}
					</div>
				</div>
			}
			{
				bookRecommEles.length > 0 &&
				<PaginationButtons handlePageNumberChange={setPageNumber} />
			}
		</>
	);
}


export default App;