import type { FC } from "react";
import { useNavigation, useSubmit } from "react-router";
import { InputVirtualKeyboard } from "../shared/input-virtual-keyboard";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader, Trash } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form as RRForm } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const formSchema = z.object({
  team: z.enum(["A", "B"], "Team is required"),
  amount: z.number().min(10000, "Amount must be at least 10000"),
});

export const FormMyBet: FC<{
  team?: "A" | "B";
  amount?: number;
}> = ({ team, amount }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team: team ?? "A",
      amount: amount ?? 10000,
    },
  });
  const navigation = useNavigation();
  const submit = useSubmit();

  return (
    <Form {...form}>
      <RRForm
        method="post"
        onSubmit={form.handleSubmit(async (values) => {
          await submit(values, {
            encType: "multipart/form-data",
            method: "post",
          });
        })}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            disabled={navigation.state === "submitting"}
            title="Withdraw"
            type="button"
            onClick={() => submit(null, { method: "delete" })}
          >
            {navigation.state === "submitting" ? (
              <Loader className="animate-spin" />
            ) : (
              <Trash />
            )}
          </Button>
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <input type="hidden" {...field} />
                <FormLabel>Team</FormLabel>
                <FormControl>
                  <ToggleGroup
                    {...field}
                    type="single"
                    value={field.value}
                    onValueChange={field.onChange}
                    variant={"outline"}
                    className="[&_>button]:px-5"
                  >
                    <ToggleGroupItem value="A">A</ToggleGroupItem>
                    <ToggleGroupItem value="B">B</ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grow">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <InputVirtualKeyboard
                      {...field}
                      min={10000}
                      value={field.value}
                      onChangeValue={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">
            {navigation.state === "submitting" ? (
              <Loader className="animate-spin" />
            ) : (
              <ArrowUp />
            )}
          </Button>
        </div>
      </RRForm>
    </Form>
  );
};
