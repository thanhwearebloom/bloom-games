import type { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Form as RRForm, useNavigation, useSubmit } from "react-router";
import { Input } from "@/components/ui/input";
export const formSchema = z.object({
  teamA: z.string().min(1, "Team A is required"),
  teamB: z.string().min(1, "Team B is required"),
});

type FormSchema = z.infer<typeof formSchema>;

export const FormCreateBet: FC = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const navigation = useNavigation();
  const submit = useSubmit();

  return (
    <Form {...form}>
      <RRForm
        className="space-y-3"
        method="post"
        onSubmit={form.handleSubmit(async (values) => {
          await submit(values, {
            method: "post",
            encType: "multipart/form-data",
          });
          form.reset();
        })}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="teamA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team A</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team B</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Creating..." : "Create"}
        </Button>
      </RRForm>
    </Form>
  );
};
