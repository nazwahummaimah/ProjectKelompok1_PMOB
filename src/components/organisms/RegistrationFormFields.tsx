import { FormField } from '../molecules/FormField';

type Props = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
};

export function RegistrationFormFields(props: Props) {
  return (
    <>
      <FormField
        label="Nama lengkap" icon="person-outline" value={props.name}
        onChangeText={props.onNameChange} placeholder="Masukkan nama lengkap"
        autoCapitalize="words" error={props.errors?.name}
      />
      <FormField
        label="Email" icon="mail-outline" value={props.email}
        onChangeText={props.onEmailChange} placeholder="nama@email.com"
        autoCapitalize="none" keyboardType="email-address"
        error={props.errors?.email}
      />
      <FormField
        label="Password" icon="lock-closed-outline" value={props.password}
        onChangeText={props.onPasswordChange} placeholder="Buat password"
        secureTextEntry={!props.showPassword}
        trailingIcon={props.showPassword ? 'eye-off-outline' : 'eye-outline'}
        onTrailingPress={props.onTogglePassword} error={props.errors?.password}
      />
      <FormField
        label="Konfirmasi password" icon="lock-closed-outline" value={props.confirmPassword}
        onChangeText={props.onConfirmPasswordChange} placeholder="Ulangi password"
        secureTextEntry={!props.showConfirmPassword}
        trailingIcon={props.showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
        onTrailingPress={props.onToggleConfirmPassword}
        error={props.errors?.confirmPassword}
      />
    </>
  );
}
