import React, { useState } from 'react';
import { 
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container
} from '@mui/material';

interface QuadraticResult {
  x1: number | null;
  x2: number | null;
  discriminant: number;
}

const QuadraticCalculator: React.FC = () => {
  const [coefficients, setCoefficients] = useState({
    a: '',
    b: '',
    c: ''
  });
  const [result, setResult] = useState<QuadraticResult | null>(null);
  const [error, setError] = useState<string>('');

  const solveQuadratic = () => {
    const a = parseFloat(coefficients.a);
    const b = parseFloat(coefficients.b);
    const c = parseFloat(coefficients.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setError('Please enter valid numbers for all coefficients');
      return;
    }

    if (a === 0) {
      setError('Coefficient "a" cannot be zero as this would not be a quadratic equation');
      return;
    }

    const discriminant = b * b - 4 * a * c;
    let x1: number | null = null;
    let x2: number | null = null;

    if (discriminant > 0) {
      x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    } else if (discriminant === 0) {
      x1 = x2 = -b / (2 * a);
    }

    setResult({ x1, x2, discriminant });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCoefficients(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getResultText = () => {
    if (!result) return '';
    
    if (result.discriminant < 0) {
      return 'This equation has no real solutions (complex roots)';
    } else if (result.discriminant === 0) {
      return `This equation has one repeated solution: x = ${result.x1?.toFixed(4)}`;
    } else {
      return `Solutions: x₁ = ${result.x1?.toFixed(4)}, x₂ = ${result.x2?.toFixed(4)}`;
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Quadratic Equation Solver
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Solves equations in the form: ax² + bx + c = 0
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography variant="subtitle1" align="center" sx={{ fontFamily: 'monospace', background: '#f5f5f5', borderRadius: 1, px: 1, py: 0.5 }}>
            x = (-b ± √(b² - 4ac)) / 2a
          </Typography>
        </Box>
        
        <Box component="form" sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="a"
              name="a"
              value={coefficients.a}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
              error={error.includes('a')}
            />
            <TextField
              label="b"
              name="b"
              value={coefficients.b}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
            />
            <TextField
              label="c"
              name="c"
              value={coefficients.c}
              onChange={handleInputChange}
              type="number"
              fullWidth
              required
            />
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={solveQuadratic}
            sx={{ mb: 2 }}
          >
            Solve
          </Button>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {result && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom align="center">
                Result
              </Typography>
              <Typography align="center">
                {getResultText()}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                Discriminant: {result.discriminant}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default QuadraticCalculator;
