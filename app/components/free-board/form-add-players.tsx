import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, type FC } from "react";
import { useForm } from "react-hook-form";
import { Form as RRForm, useSubmit } from "react-router";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "lucide-react";

export const formSchema = z.object({
  players: z
    .array(
      z.string("Player is required").min(1, "Player is required"),
      "Players is required"
    )
    .refine((players) => {
      return players.every((player, index) => {
        return players.indexOf(player) === index;
      });
    }, "Players must be different"),
});

type FormSchema = z.infer<typeof formSchema>;

export const FreeBoardFormAddPlayers: FC<{
  users: {
    value: string;
    label: string;
  }[];
  existingPlayers: string[];
  onSubmit?: () => void;
}> = ({ users, existingPlayers, onSubmit }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: [],
    },
  });
  const addingPlayers = form.watch("players");
  const submit = useSubmit();
  const [isPending, startTransition] = useTransition();
  const isAddingExistingPlayer = useMemo(() => {
    return addingPlayers.some((player) => {
      return existingPlayers.includes(player);
    });
  }, [addingPlayers, existingPlayers]);
  const filteredUsers = useMemo(() => {
    return users.filter((u) => !existingPlayers.includes(u.label));
  }, [users, existingPlayers]);
  return (
    <Form {...form}>
      <RRForm
        method="post"
        onSubmit={form.handleSubmit(async (values) => {
          startTransition(async () => {
            await submit(values, {
              method: "post",
              encType: "multipart/form-data",
            });
            form.reset({
              players: [],
            });
            onSubmit?.();
          });
        })}
      >
        {isAddingExistingPlayer && (
          <Alert variant={"destructive"} className="mb-5">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>Some players are already added.</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="players"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Players</FormLabel>
              <FormControl>
                <CreatableSelect<{ value: string; label: string }, true>
                  options={filteredUsers}
                  isMulti={true}
                  placeholder="Select players"
                  value={field.value?.map((value) => ({
                    value,
                    label: value,
                  }))}
                  onChange={(value) => {
                    field.onChange(value?.map((v) => v.value));
                  }}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button type="submit" disabled={isPending || isAddingExistingPlayer}>
            {isPending ? <Loader className="animate-spin" /> : "Add Players"}
          </Button>
        </div>
      </RRForm>
    </Form>
  );
};
