const express = require('express');
const { saveAssessment, getUserAssessments } = require('../models/database');

const router = express.Router();

const calculateDosha = (responses) => {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  
  Object.values(responses).forEach(value => {
    if (value === 'vata') scores.vata++;
    else if (value === 'pitta') scores.pitta++;
    else if (value === 'kapha') scores.kapha++;
  });
  
  const total = scores.vata + scores.pitta + scores.kapha;
  const percentages = {
    vata: total > 0 ? Math.round((scores.vata / total) * 100) : 0,
    pitta: total > 0 ? Math.round((scores.pitta / total) * 100) : 0,
    kapha: total > 0 ? Math.round((scores.kapha / total) * 100) : 0
  };
  
  const sortedDoshas = Object.keys(percentages).sort((a, b) => percentages[b] - percentages[a]);
  const primaryDosha = sortedDoshas[0];
  const secondaryDosha = sortedDoshas[1];
  
  let constitutionType;
  if (percentages[primaryDosha] >= 60) {
    constitutionType = `${primaryDosha.charAt(0).toUpperCase() + primaryDosha.slice(1)} Dominant`;
  } else if (percentages[secondaryDosha] >= 25) {
    constitutionType = `${primaryDosha.charAt(0).toUpperCase() + primaryDosha.slice(1)}-${secondaryDosha.charAt(0).toUpperCase() + secondaryDosha.slice(1)}`;
  } else {
    constitutionType = `${primaryDosha.charAt(0).toUpperCase() + primaryDosha.slice(1)} Predominant`;
  }
  
  const recommendations = {
    vata: {
      diet: ['Warm, cooked foods', 'Sweet, sour, salty tastes', 'Regular meal times', 'Avoid cold, dry foods'],
      lifestyle: ['Regular routine', 'Adequate rest', 'Warm environment', 'Gentle activities'],
      exercise: ['Yoga', 'Walking', 'Swimming', 'Avoid excessive cardio'],
      mentalHealth: ['Meditation', 'Calming music', 'Massage', 'Avoid overstimulation']
    },
    pitta: {
      diet: ['Cool, fresh foods', 'Sweet, bitter, astringent tastes', 'Avoid spicy, oily foods', 'Moderate portions'],
      lifestyle: ['Cool environment', 'Avoid overheating', 'Moderate activity', 'Stress management'],
      exercise: ['Swimming', 'Cycling', 'Moderate intensity', 'Avoid competitive sports'],
      mentalHealth: ['Cooling pranayama', 'Nature walks', 'Avoid anger triggers', 'Practice patience']
    },
    kapha: {
      diet: ['Light, warm foods', 'Spicy, bitter, astringent tastes', 'Avoid heavy, oily foods', 'Smaller portions'],
      lifestyle: ['Active routine', 'Stimulating environment', 'Regular exercise', 'Avoid oversleeping'],
      exercise: ['Running', 'Aerobics', 'Vigorous activities', 'Daily movement'],
      mentalHealth: ['Energizing practices', 'Social activities', 'Avoid lethargy', 'Stay motivated']
    }
  };
  
  return {
    primaryDosha,
    secondaryDosha: percentages[secondaryDosha] >= 25 ? secondaryDosha : null,
    constitutionType,
    percentages,
    scores,
    totalQuestions: total,
    recommendations: recommendations[primaryDosha]
  };
};

// Submit assessment
router.post('/submit', async (req, res) => {
  try {
    const responses = req.body.responses || req.body;
    const result = calculateDosha(responses);
    
    let assessmentId = null;
    if (req.session.userId) {
      const assessment = await saveAssessment(req.session.userId, responses, result.primaryDosha);
      assessmentId = assessment.id;
    }
    
    res.json({ 
      message: 'Assessment completed',
      result: result,
      assessmentId: assessmentId,
      saved: !!assessmentId
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process assessment', error: error.message });
  }
});

// Get assessment history
router.get('/history', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const assessments = await getUserAssessments(req.session.userId);
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get assessment history', error: error.message });
  }
});

module.exports = router;