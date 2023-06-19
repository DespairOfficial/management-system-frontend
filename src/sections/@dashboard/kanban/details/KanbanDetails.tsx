import { useState, useRef, useCallback, useEffect } from 'react';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Stack, Drawer, Avatar, Tooltip, Divider, TextField, Box, IconButton } from '@mui/material';
// @types
import {
  IEditKanbanCard,
  IEditKanbanComment,
  IKanbanAssignee,
  IKanbanCard,
  IKanbanComment,
} from '../../../../@types/kanban';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import DateRangePicker, { useDateRangePicker } from '../../../../components/date-range-picker';
//
import KanbanInputName from '../KanbanInputName';
import KanbanDetailsToolbar from './KanbanDetailsToolbar';
import KanbanContactsDialog from '../KanbanContactsDialog';
import KanbanDetailsCommentList from './KanbanDetailsCommentList';
import KanbanDetailsAttachments from './KanbanDetailsAttachments';
import KanbanDetailsPrioritizes from './KanbanDetailsPrioritizes';
import KanbanDetailsCommentInput from './KanbanDetailsCommentInput';
import { staticFilePath } from '../../../../components/file-thumbnail';
import { useDispatch } from '../../../../redux/store';
import { createComment, editTask } from '../../../../redux/slices/kanban';
import useDebounce from '../../../../utils/useDebounce';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 120,
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

type Props = {
  task: IKanbanCard;
  openDetails: boolean;
  columnId: string;
  onCloseDetails: VoidFunction;
  onDeleteTask: VoidFunction;
};

export default function KanbanDetails({
  task,
  openDetails,
  columnId,
  onCloseDetails,
  onDeleteTask,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const [liked, setLiked] = useState(false);

  const [prioritize, setPrioritize] = useState(task.prioritize);

  const [taskName, setTaskName] = useState(task.name);

  const [openContacts, setOpenContacts] = useState(false);

  const [completed, setCompleted] = useState(task.completed);

  const [taskDescription, setTaskDescription] = useState(task.description);

  const debouncedName = useDebounce(taskName, 300);

  const debouncedDescription = useDebounce(taskDescription, 300);

  const startDateToPicker =
    typeof task.due[0] === 'string' ? new Date(task.due[0]) : task.due[0] ?? null;

  const endDateToPicker =
    typeof task.due[1] === 'string' ? new Date(task.due[1]) : task.due[1] ?? null;
  const {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open: openPicker,
    onOpen: onOpenPicker,
    onClose: onClosePicker,
    isSelected: isSelectedValuePicker,
    isError,
    shortLabel,
  } = useDateRangePicker(startDateToPicker, endDateToPicker);

  const onClosePickerAndSend = () => {
    sendEditedTask({
      ...task,
      due: [startDate?.toISOString() ?? null, endDate?.toISOString() ?? null],
    });
    onClosePicker();
  };

  const handleLiked = () => {
    setLiked(!liked);
  };

  const handleCompleted = () => {
    setCompleted(!completed);
    sendEditedTask({ ...task, completed: !completed });
  };

  const handleOpenContacts = () => {
    setOpenContacts(true);
  };

  const handleCloseContacts = () => {
    setOpenContacts(false);
  };

  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };

  const setAttachments = (attachments: (File | string)[]) => {
    sendEditedTask({ ...task, attachments });
  };

  const addComment = (comment: IEditKanbanComment) => {
    dispatch(createComment({ comment, cardId: task.id }));
  };

  const sendEditedTask = (updatedTask: IEditKanbanCard) => {
    dispatch(
      editTask({
        card: updatedTask,
        columnId,
      })
    );
  };

  const addAssignee = (newAssignee: IKanbanAssignee) => {
    sendEditedTask({ ...task, assignee: [...task.assignee, newAssignee] });
  };

  const removeAssignee = (assigneeToRemove: IKanbanAssignee) => {
    sendEditedTask({
      ...task,
      assignee: task.assignee.filter((item) => item.id !== assigneeToRemove.id),
    });
  };

  useEffect(() => {
    sendEditedTask({ ...task, name: debouncedName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  useEffect(() => {
    sendEditedTask({ ...task, description: debouncedDescription });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescription]);

  const handleChangeTaskName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handleChangeTaskDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(event.target.value);
  };

  const handleChangePrioritize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrioritize = (event.target as HTMLInputElement).value;
    setPrioritize(newPrioritize);
    sendEditedTask({ ...task, prioritize: newPrioritize });
  };

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      PaperProps={{
        sx: {
          width: {
            xs: 1,
            sm: 480,
          },
        },
      }}
    >
      <KanbanDetailsToolbar
        taskName={task.name}
        fileInputRef={fileInputRef}
        liked={liked}
        completed={completed}
        onLike={handleLiked}
        onAttach={handleClickAttach}
        onDelete={onDeleteTask}
        onCompleted={handleCompleted}
        onCloseDetails={onCloseDetails}
      />

      <Divider />

      <Scrollbar>
        <Stack spacing={3} sx={{ px: 2.5, pt: 3, pb: 5 }}>
          {/* Task name */}
          <KanbanInputName
            placeholder="Task name"
            value={taskName}
            onChange={handleChangeTaskName}
          />

          {/* Assignee */}
          <Stack direction="row">
            <StyledLabel sx={{ height: 40, lineHeight: '40px', my: 0.5 }}>Assignee</StyledLabel>

            <Stack direction="row" flexWrap="wrap" alignItems="center">
              {task.assignee.map((user, index) => (
                <Avatar
                  key={user.id ?? `avatar_for_kanban_details_${index}`}
                  alt={user.name}
                  src={staticFilePath(user.image)}
                  sx={{ m: 0.5 }}
                />
              ))}

              <Tooltip title="Add assignee">
                <IconButton
                  onClick={handleOpenContacts}
                  sx={{
                    p: 1,
                    ml: 0.5,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                    border: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  <Iconify icon="eva:plus-fill" />
                </IconButton>
              </Tooltip>

              <KanbanContactsDialog
                assignee={task.assignee}
                open={openContacts}
                onClose={handleCloseContacts}
                onAddAssignee={addAssignee}
                onRemoveAssignee={removeAssignee}
              />
            </Stack>
          </Stack>

          {/* Due date */}
          <Stack direction="row" alignItems="center">
            <StyledLabel> Due date </StyledLabel>
            <>
              {isSelectedValuePicker ? (
                <Box
                  onClick={onOpenPicker}
                  sx={{
                    typography: 'body2',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.72 },
                  }}
                >
                  {shortLabel}
                </Box>
              ) : (
                <Tooltip title="Add due date">
                  <IconButton
                    onClick={onOpenPicker}
                    sx={{
                      p: 1,
                      ml: 0.5,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                      border: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Iconify icon="eva:plus-fill" />
                  </IconButton>
                </Tooltip>
              )}

              <DateRangePicker
                variant="calendar"
                title="Choose due date"
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
                open={openPicker}
                onClose={onClosePickerAndSend}
                isSelected={isSelectedValuePicker}
                isError={isError}
              />
            </>
          </Stack>

          {/* Prioritize */}
          <Stack direction="row" alignItems="center">
            <StyledLabel>Prioritize</StyledLabel>

            <KanbanDetailsPrioritizes
              prioritize={prioritize}
              onChangePrioritize={handleChangePrioritize}
            />
          </Stack>

          {/* Description */}
          <Stack direction="row">
            <StyledLabel> Description </StyledLabel>

            <TextField
              fullWidth
              multiline
              size="small"
              value={taskDescription}
              onChange={handleChangeTaskDescription}
              InputProps={{
                sx: { typography: 'body2' },
              }}
            />
          </Stack>

          {/* Attachments */}
          <Stack direction="row">
            <StyledLabel sx={{ py: 0.5 }}>Attachments</StyledLabel>
            <KanbanDetailsAttachments
              attachments={task.attachments}
              setAttachments={setAttachments}
            />
          </Stack>
        </Stack>

        {!!task.comments.length && <KanbanDetailsCommentList comments={task.comments} />}
      </Scrollbar>

      <Divider />

      <KanbanDetailsCommentInput addComment={addComment} />
    </Drawer>
  );
}
