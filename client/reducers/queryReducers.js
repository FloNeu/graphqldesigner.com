import * as types from '../actions/action-types';

const initialState = {
  queryMode: 'create',
  queriesIndex: 0,
  subQueryIndex: -1,
  queries: {},
  newQuery: {
    name: '',
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {},
    subQueries: []
  },
  subQuery: {
    // queryName: '',
    tableIndex: -1,
    fieldIndex: -1,
    returnFields: {}
  },
  newSubQuerySelected: false
};

const queryReducers = (state = initialState, action) => {

  const customQueryReset = {
    queryName: '',
    tableIndex: -1,
    fieldIndex: -1
  }

  let subQueryIndex = state.subQueryIndex;
  let newReturnFields;
  let newReturnQuery;
  let newSubQuery;
  let tempNewQuery;
  let newQueriesIndex;

  switch (action.type) {
    case types.CREATE_QUERY: 
      // const newQuery = Object.assign({}, action.payload)
      newReturnQuery = Object.assign({}, state.queries, {[state.queriesIndex]: action.payload});
      newQueriesIndex = state.queriesIndex + 1;
      
      return{
        ...state,
        queriesIndex: newQueriesIndex,
        queryMode: 'customQuery',
        queries: newReturnQuery
      }
    
    // User inputs name for new customized query
    case types.HANDLE_NEW_QUERY_NAME:
      tempNewQuery = Object.assign({}, state.newQuery, 
        {name: action.payload.value})
      
      return{
        ...state,
        newQuery: tempNewQuery
      }
      
    case types.CREATE_RETURN_FIELDS:
      newReturnFields = Object.assign({}, state.newQuery.returnFields, )
      
      
      Object.assign({}, state.newQuery, {returnFields : 
        Object.assign({}, state.newQuery.returnFields[action.payload.index], {name: action.payload.name, value: action.payload.value})})
        
      return{
        ...state,
        newQuery: newReturnFields
      }
        
    case types.HANDLE_RETURN_VALUES:
    let { subQueryIndex, fieldIndex, tableIndex } = action.payload;
    if(subQueryIndex < 0) {
      if(!!state.newQuery.returnFields[fieldIndex]){
        newReturnFields = Object.assign({}, state.newQuery.returnFields)
        delete newReturnFields[fieldIndex];
        newReturnQuery = Object.assign({}, state.newQuery, {returnFields: newReturnFields})
      } else {
        newReturnFields = Object.assign({}, state.newQuery.returnFields, {[fieldIndex]: {fieldIndex, tableIndex}})
        newReturnQuery = Object.assign({}, state.newQuery, {returnFields: newReturnFields})
      }
      return {
        ...state,
        newQuery: newReturnQuery
      }
    } else {

      return {
        ...state
      }
    }

    // User selects type or field for customized query
    case types.HANDLE_NEW_QUERY_CHANGE:
      if (action.payload.name === 'tableIndex') {
        const fieldIndex = {'fieldIndex': -1}; // reset field since a new table was selected
        const tableIndex = {[action.payload.name]: action.payload.value}
        tempNewQuery = Object.assign({}, state.newQuery, tableIndex, fieldIndex)
      } else {
        tempNewQuery = Object.assign({}, state.newQuery, 
          {[action.payload.name]: action.payload.value})
      }
      
      return{
        ...state,
        newQuery: tempNewQuery
      }
    

    case types.HANDLE_SUBQUERY_SELECTOR:
    newSubQuery = Object.assign({}, state.subQuery, {
      tableIndex: action.payload.tableIndex,
      fieldIndex: action.payload.fieldIndex
    })
      return{
        ...state,
        subQuery: newSubQuery
      }
        
    case types.HANDLE_NEW_SUBQUERY_TOGGLE:
      if(!!state.subQuery.returnFields[action.payload.fieldIndex]){
        newReturnFields = Object.assign({}, state.subQuery.returnFields)
        delete newReturnFields[action.payload.fieldIndex];
        newSubQuery = Object.assign({}, state.subQuery, {returnFields: newReturnFields})
      } else {
        newReturnFields = Object.assign({}, state.subQuery.returnFields, {
          [action.payload.fieldIndex]: {
            fieldIndex: action.payload.fieldIndex, 
            tableIndex: action.payload.tableIndex
          }})
        newSubQuery = Object.assign({}, state.subQuery, {returnFields: newReturnFields})
      }
      return {
        ...state,
        subQuery: newSubQuery
      }

    case types.SUBMIT_SUBQUERY_HANDLER:
      let newSubQueryIndex = state.subQueryIndex;
      newSubQueryIndex += 1;

      newSubQuery = Object.assign({}, state.subQuery)
      newReturnQuery = Object.assign({}, state.newQuery)

      newReturnQuery.subQueries.push(newSubQuery);

      return {
        ...state,
        subQueryIndex : newSubQueryIndex,
        newQuery: newReturnQuery,
        subQuery: customQueryReset
      }

        
        default:
        return state;
      }
    };
    
    export default queryReducers;