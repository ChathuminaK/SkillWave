import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper,
  FormControl, FormHelperText, InputLabel, Chip, IconButton,
  CircularProgress, Alert, Stack, Divider
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery, useMutation } from 'react-query';
import { learningPlanApi } from '../services/api';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  skills: Yup.array()
    .min(1, 'At least one skill is required')
    .max(10, 'Maximum 10 skills are allowed'),
});

export default function CreateLearningPlanPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const isEditMode = !!planId;

  const { data: planData, isLoading: fetchLoading } = useQuery(
    ['learningPlan', planId],
    () => learningPlanApi.getPlan(planId),
    {
      enabled: isEditMode,
      onError: () => {
        setError('Failed to load learning plan. Please try again.');
      }
    }
  );

  const createMutation = useMutation(
    (data) => learningPlanApi.createPlan(data),
    {
      onSuccess: (response) => {
        navigate(`/learning-plans/${response.data.id}`);
      },
      onError: (err) => {
        setError(err.response?.data?.message || 'Failed to create learning plan');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => learningPlanApi.updatePlan(id, data),
    {
      onSuccess: (response) => {
        navigate(`/learning-plans/${response.data.id}`);
      },
      onError: (err) => {
        setError(err.response?.data?.message || 'Failed to update learning plan');
      }
    }
  );

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      skills: [],
    },
    validationSchema,
    onSubmit: (values) => {
      setError('');
      if (isEditMode) {
        updateMutation.mutate({ id: planId, data: values });
      } else {
        createMutation.mutate(values);
      }
    },
  });

  useEffect(() => {
    if (planData?.data && isEditMode) {
      const plan = planData.data;
      formik.setValues({
        title: plan.title || '',
        description: plan.description || '',
        skills: plan.skills || [],
      });
    }
  }, [planData, isEditMode]);

  const handleSkillAdd = () => {
    const skill = newSkill.trim();
    if (
      skill && 
      !formik.values.skills.includes(skill) && 
      formik.values.skills.length < 10
    ) {
      formik.setFieldValue('skills', [...formik.values.skills, skill]);
      setNewSkill('');
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    formik.setFieldValue(
      'skills',
      formik.values.skills.filter((skill) => skill !== skillToDelete)
    );
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  if (fetchLoading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 4,
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
      }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            textAlign: 'center',
            background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {isEditMode ? 'Edit Learning Plan' : 'Create Learning Plan'}
          </Typography>

          <Divider sx={{ borderColor: 'divider', my: 2 }} />

          {error && (
            <Alert severity="error" sx={{ 
              borderRadius: 2,
              boxShadow: 'none'
            }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                variant="outlined"
                id="title"
                label="Title"
                name="title"
                autoFocus
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                disabled={createMutation.isLoading || updateMutation.isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                id="description"
                label="Description"
                name="description"
                multiline
                rows={5}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={createMutation.isLoading || updateMutation.isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  }
                }}
              />

              <FormControl 
                fullWidth 
                error={formik.touched.skills && Boolean(formik.errors.skills)}
              >
                <InputLabel htmlFor="skills" shrink sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  transform: 'translate(0, -6px) scale(0.75)'
                }}>
                  Skills
                </InputLabel>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="newSkill"
                      placeholder="Type a skill and press Enter"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleSkillKeyPress}
                      disabled={formik.values.skills.length >= 10 || createMutation.isLoading || updateMutation.isLoading}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: 'divider',
                          },
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSkillAdd}
                      disabled={!newSkill.trim() || formik.values.skills.length >= 10 || createMutation.isLoading || updateMutation.isLoading}
                      sx={{
                        minWidth: 'auto',
                        borderRadius: 2,
                        px: 2,
                        boxShadow: 'none'
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Stack>

                  {formik.values.skills.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1,
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: 'action.hover',
                      minHeight: 56
                    }}>
                      {formik.values.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          onDelete={() => handleSkillDelete(skill)}
                          disabled={createMutation.isLoading || updateMutation.isLoading}
                          sx={{
                            borderRadius: 1,
                            backgroundColor: 'primary.lighter',
                            color: 'primary.dark',
                            '& .MuiChip-deleteIcon': {
                              color: 'primary.dark',
                              '&:hover': {
                                color: 'primary.main'
                              }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {formik.touched.skills && formik.errors.skills && (
                    <FormHelperText error sx={{ ml: 0 }}>
                      {formik.errors.skills}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  {(createMutation.isLoading || updateMutation.isLoading) ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEditMode ? (
                    'Update Plan'
                  ) : (
                    'Create Plan'
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}