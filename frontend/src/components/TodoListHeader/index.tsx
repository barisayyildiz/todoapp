import { Box, Button, TextField, Select, MenuItem } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import { selectFilter, setQuery, setSelectedTags } from "../../store/filter";
import { SelectChangeEvent } from '@mui/material/Select';
import { TodoListHeaderProps } from "../../types";

export function TodoListHeader(props: TodoListHeaderProps) {
  const { handleOpen } = props;
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    dispatch(setSelectedTags(value as string[]));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setQuery(query));
  }

  return (
    <>
      <Box style={{
        marginLeft: 'auto',
      }}>
        <Button onClick={handleOpen} variant="contained">Create</Button>
      </Box>
      <Box style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '8px'
      }}>
        <TextField 
          style={{
            width:'100%'
          }}
          placeholder="Search" 
          className="grow" 
          variant="outlined" 
          onChange={((event: any) => handleSearchChange(event.target.value))} />
        <Select
          multiple
          value={filter.selectedTags}
          onChange={handleChange}
          style={{
            flexGrow: 1,
            maxWidth: '50%',
            minWidth: '50%'
          }}
        >
          {
            Array.from(filter.tags).map((tag, index) => (
              <MenuItem key={index} value={tag}>{tag}</MenuItem>
            ))
          }
        </Select>
      </Box>
    </>
  );
}
