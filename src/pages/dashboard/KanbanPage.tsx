import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getBoard, persistColumn, persistCard } from '../../redux/slices/kanban';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { hideScrollbarX } from '../../utils/cssStyles';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { SkeletonKanbanColumn } from '../../components/skeleton';
// sections
import { KanbanColumn, KanbanColumnAdd } from '../../sections/@dashboard/kanban';
import { IProject } from '../../@types/project';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function KanbanPage() {
  const dispatch = useDispatch();

  const { board } = useSelector((state) => state.kanban);

  const [projects, setProjects] = useState<IProject[]>([]);

  const [currentProject, setCurrentProject] = useState<IProject | undefined>(undefined);

  const [idForProject, setIdForProject] = useState('Not selected');

  const handleChangeProject = (event: SelectChangeEvent) => {
    const id = event.target.value as string;
    setIdForProject(id);
    const foundedProject = projects.find((item) => item.id === id);

    setCurrentProject(foundedProject);
  };

  useEffect(() => {
    const getProjectsWithBoards = async () => {
      const response = await axios.get('/api/project');
      setProjects(response.data);
      setCurrentProject(response.data[0]);
			setIdForProject(response.data[0].id)
    };
    getProjectsWithBoards();
  }, []);

  useEffect(() => {
    if (currentProject && currentProject.kanbanBoard) {
      dispatch(getBoard(currentProject.kanbanBoard[0].id));
    }
  }, [dispatch, currentProject]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    if (type === 'column') {
      const newColumnOrder = Array.from(board.columnOrder);

      newColumnOrder.splice(source.index, 1);

      newColumnOrder.splice(destination.index, 0, draggableId);

      dispatch(persistColumn(newColumnOrder));
      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start.id === finish.id) {
      const updatedCardIds = [...start.cardIds];

      updatedCardIds.splice(source.index, 1);

      updatedCardIds.splice(destination.index, 0, draggableId);

      const updatedColumn = {
        ...start,
        cardIds: updatedCardIds,
      };

      dispatch(
        persistCard({
          ...board.columns,
          [updatedColumn.id]: updatedColumn,
        })
      );
      return;
    }

    const startCardIds = [...start.cardIds];

    startCardIds.splice(source.index, 1);

    const updatedStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = [...finish.cardIds];

    finishCardIds.splice(destination.index, 0, draggableId);

    const updatedFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    dispatch(
      persistCard({
        ...board.columns,
        [updatedStart.id]: updatedStart,
        [updatedFinish.id]: updatedFinish,
      })
    );
  };

  return (
    <>
      <Helmet>
        <title> Kanban </title>
      </Helmet>
      <Container sx={{ mb: 2 }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Project</InputLabel>
          <Select
            id="demo-simple-select"
            labelId="demo-simple-select-label"
            value={idForProject}
            onChange={handleChangeProject}
            label="Select project"
          >
            {projects.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Container>

      <Container maxWidth={false} sx={{ height: 1 }}>
        <CustomBreadcrumbs
          heading="Kanban"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Kanban' },
          ]}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <Stack
                {...provided.droppableProps}
                ref={provided.innerRef}
                spacing={3}
                direction="row"
                alignItems="flex-start"
                sx={{
                  height: 1,
                  overflowY: 'hidden',
                  ...hideScrollbarX,
                }}
              >
                {!board.columnOrder.length ? (
                  <SkeletonKanbanColumn />
                ) : (
                  board.columnOrder.map((columnId, index) => (
                    <KanbanColumn
                      index={index}
                      key={columnId}
                      column={board.columns[columnId]}
                      cards={board.cards}
                    />
                  ))
                )}

                {provided.placeholder}
                <KanbanColumnAdd boardId={board.id} />
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    </>
  );
}
