import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import useAuth from "app/hooks/useAuth"; // Import the useAuth hook

// STYLED COMPONENTS
const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    margin: "1rem",
    borderRadius: 12
  },
  ".img-wrapper": {
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const ContentBox = styled("div")(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default
}));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { resetPassword } = useAuth(); // Use the resetPassword function from useAuth

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Email é obrigatório");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      enqueueSnackbar("Email de redefinição de senha enviado. Verifique sua caixa de entrada.", { variant: "success" });
      navigate("/session/signin");
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/user-not-found") {
        setEmailError("Nenhum usuário encontrado com este email.");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Endereço de email inválido.");
      } else {
        enqueueSnackbar("Ocorreu um erro ao enviar o email de redefinição de senha.", { variant: "error" });
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  return (
    <StyledRoot>
      <Card className="card">
        <div className="img-wrapper">
          <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="Illustration" />
        </div>

        <ContentBox>
          <form onSubmit={handleFormSubmit}>
            <TextField
              type="email"
              name="email"
              size="small"
              label="Email"
              value={email}
              variant="outlined"
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError}
              sx={{ mb: 3, width: "100%" }}
            />

            <LoadingButton
              fullWidth
              type="submit"
              color="primary"
              loading={loading}
              variant="contained"
            >
              Redefinir Senha
            </LoadingButton>

            <Button
              fullWidth
              color="primary"
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}
            >
              Voltar
            </Button>
          </form>
        </ContentBox>
      </Card>
    </StyledRoot>
  );
}