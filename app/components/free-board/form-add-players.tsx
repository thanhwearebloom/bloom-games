import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { Form as RRForm, useNavigation, useSubmit } from "react-router";
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

export const formSchema = z.object({
  players: z.array(
    z.string("Player is required").min(1, "Player is required"),
    "Players is required",
  ),
});

type FormSchema = z.infer<typeof formSchema>;

export const FreeBoardFormAddPlayers: FC<{
  users: {
    value: string;
    label: string;
  }[];
  onSubmit?: () => void;
}> = ({ users, onSubmit }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const submit = useSubmit();
  const navigation = useNavigation();
  return (
    <Form {...form}>
      <RRForm
        method="post"
        onSubmit={form.handleSubmit(async (values) => {
          await submit(values, {
            method: "post",
            encType: "multipart/form-data",
          });
          form.reset({
            players: [],
          });
          onSubmit?.();
        })}
      >
        <FormField
          control={form.control}
          name="players"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Players</FormLabel>
              <FormControl>
                <CreatableSelect<{ value: string; label: string }, true>
                  options={users}
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
          <Button type="submit" disabled={navigation.state === "submitting"}>
            Add Players
          </Button>
        </div>
      </RRForm>
    </Form>
  );
};
