import { useCallback, type FC } from "react";
import { useSubmit } from "react-router";
import { FormAddPlayers, type FormSchema } from "../shared/form-add-players";

export const FreeCardFormAddPlayers: FC<{
  users: {
    value: string;
    label: string;
  }[];
  existingPlayers: string[];
  onSubmit?: () => void;
}> = ({ users, existingPlayers, onSubmit }) => {
  const submit = useSubmit();
  const submitHandler = useCallback(
    async (values: FormSchema) => {
      await submit(values, {
        method: "post",
        encType: "multipart/form-data",
      });
      onSubmit?.();
    },
    [submit, onSubmit]
  );
  return (
    <FormAddPlayers
      users={users}
      existingPlayers={existingPlayers}
      onSubmit={submitHandler}
    />
  );
};
