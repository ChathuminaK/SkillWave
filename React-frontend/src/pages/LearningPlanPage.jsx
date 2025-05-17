import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, Button, Divider, List, ListItem,
  ListItemText, ListItemIcon, Checkbox, TextField, IconButton, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Chip, Stack, LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as MoveUpIcon,
  ArrowDownward as MoveDownIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { AuthContext } from '../contexts/AuthContext';
import { learningPlanApi } from '../services/api';

export default function LearningPlanPage() {
  const { planId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newStep, setNewStep] = useState('');
  const [editingStep, setEditingStep] = useState(null);
  const [editedStepContent, setEditedStepContent] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addStepError, setAddStepError] = useState('');

  const { data, isLoading, error } = useQuery(['learningPlan', planId], () => learningPlanApi.getPlan(planId), {
    enabled: !!planId
  });

  const plan = data?.data;
  const isOwner = currentUser?.id === plan?.userId;
  const completedSteps = plan?.steps?.filter(step => step.completed).length || 0;
  const totalSteps = plan?.steps?.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const queryInvalidation = () => {
    queryClient.invalidateQueries(['learningPlan', planId]);
    queryClient.invalidateQueries(['userLearningPlans']);
  };

  const toggleComplete = useMutation(
    ({ stepId, completed }) => learningPlanApi.updatePlanStep(planId, stepId, { completed }),
    { onSuccess: queryInvalidation }
  );

  const addStep = useMutation(content => learningPlanApi.addPlanStep(planId, { content }), {
    onSuccess: () => {
      queryInvalidation();
      setNewStep('');
      setAddStepError('');
    },
    onError: (error) => {
      setAddStepError(error.response?.data?.message || 'Failed to add step');
    }
  });

  const updateStep = useMutation(({ stepId, content }) => learningPlanApi.updatePlanStep(planId, stepId, { content }), {
    onSuccess: () => {
      queryInvalidation();
      setEditingStep(null);
    }
  });

  const deleteStep = useMutation(stepId => learningPlanApi.deletePlanStep(planId, stepId), {
    onSuccess: queryInvalidation
  });

  const reorderStep = useMutation(({ stepId, direction }) => learningPlanApi.reorderPlanStep(planId, stepId, direction), {
    onSuccess: queryInvalidation
  });

  const deletePlan = useMutation(() => learningPlanApi.deletePlan(planId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['userLearningPlans']);
      navigate(`/profile/${currentUser.id}`);
    }
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '80vh' }}><CircularProgress /></Box>;

  if (error || !plan) return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" color="error">{error ? 'Error loading learning plan' : 'Plan not found'}</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    </Container>
  );

  const handleAddStep = (e) => {
    e.preventDefault();
    if (newStep.trim()) addStep.mutate(newStep.trim());
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{plan.title}</Typography>
            {isOwner && (
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => navigate(`/learning-plans/edit/${planId}`)} startIcon={<EditIcon />}>Edit</Button>
                <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)} startIcon={<DeleteIcon />}>Delete</Button>
              </Stack>
            )}
          </Box>

          <Typography variant="body1">{plan.description}</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(plan.skills || []).map(skill => <Chip key={skill} label={skill} variant="outlined" />)}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Created by {plan.userName || 'User'} on {format(new Date(plan.createdAt), 'MMMM d, yyyy')}
          </Typography>

          <Stack spacing={1}>
            <Typography variant="subtitle1">Progress</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
            <Typography variant="body2">{progress}% ({completedSteps}/{totalSteps})</Typography>
          </Stack>

          <Divider />

          <Typography variant="h5">Learning Steps</Typography>
          <List>
            {plan.steps.map((step, index) => (
              <ListItem key={step.id} sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon>
                  <Checkbox checked={step.completed} onChange={() => toggleComplete.mutate({ stepId: step.id, completed: !step.completed })} />
                </ListItemIcon>
                {editingStep?.id === step.id ? (
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      multiline
                      value={editedStepContent}
                      onChange={(e) => setEditedStepContent(e.target.value)}
                    />
                    <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
                      <Button onClick={() => setEditingStep(null)}>Cancel</Button>
                      <Button variant="contained" onClick={() => updateStep.mutate({ stepId: editingStep.id, content: editedStepContent })}>Save</Button>
                    </Stack>
                  </Box>
                ) : (
                  <ListItemText
                    primary={step.content}
                    primaryTypographyProps={{ style: { textDecoration: step.completed ? 'line-through' : 'none' } }}
                  />
                )}
                {isOwner && editingStep?.id !== step.id && (
                  <Stack direction="row" spacing={0.5}>
                    {index > 0 && <IconButton onClick={() => reorderStep.mutate({ stepId: step.id, direction: 'up' })}><MoveUpIcon /></IconButton>}
                    {index < plan.steps.length - 1 && <IconButton onClick={() => reorderStep.mutate({ stepId: step.id, direction: 'down' })}><MoveDownIcon /></IconButton>}
                    <IconButton onClick={() => { setEditingStep(step); setEditedStepContent(step.content); }}><EditIcon /></IconButton>
                    <IconButton onClick={() => deleteStep.mutate(step.id)}><DeleteIcon /></IconButton>
                  </Stack>
                )}
              </ListItem>
            ))}
          </List>

          {isOwner && (
            <Box component="form" onSubmit={handleAddStep}>
              <Typography variant="subtitle1">Add New Step</Typography>
              {addStepError && <Alert severity="error">{addStepError}</Alert>}
              <Stack direction="row" spacing={1} mt={1}>
                <TextField
                  fullWidth
                  placeholder="Enter a new step..."
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                />
                <Button type="submit" variant="contained" startIcon={<AddIcon />}>Add</Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Delete Plan</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this plan?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button onClick={() => deletePlan.mutate()} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
