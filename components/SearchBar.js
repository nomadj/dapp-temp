import _ from 'lodash'
import faker from 'faker'
import React from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import Router from 'next/router';

// const source = _.times(5, () => ({
//   title: faker.company.companyName(),
//   description: faker.company.catchPhrase(),
//   image: faker.internet.avatar(),
//   price: faker.finance.amount(0, 100, 2, '$'),
// }))

const source = [
  {
    title: "stufee",
    description: "sdfsf",
    image: "favicon.png",
    price: "$100"
  }
]

const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

function SearchBar(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.title)

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(props.source, isMatch),
      })
    }, 300)
  }, [])
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
        <Search
          loading={loading}
          placeholder='Search...'
          onResultSelect={(e, data) => {
            dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
	    console.log("Contract Name: ", data.result.title, typeof(data.result.title));
	    Router.push(`/${data.result.title}?0=${data.result.address}`);
	  }
          }
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
        />
  )
}
export default SearchBar;

// <Grid.Column width={6}>
//   <Grid.Column width={10}>
//     <Segment>
//       <Header>State</Header>
//       <pre style={{ overflowX: 'auto' }}>
//         {JSON.stringify({ loading, results, value }, null, 2)}
//       </pre>
//       <Header>Options</Header>
//       <pre style={{ overflowX: 'auto' }}>
//         {JSON.stringify(props.source, null, 2)}
//       </pre>
//     </Segment>
//   </Grid.Column>
// </Grid>







      
