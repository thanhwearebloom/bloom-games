import type { FC } from "react";
import { InputVirtualKeyboard } from "../shared/input-virtual-keyboard";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form as RRForm, useSubmit } from "react-router";
import { Button } from "../ui/button";
import { useTransition } from "react";
const formSchema = z
  .object({
    points: z.array(
      z.object({
        point: z.number(),
        player: z.string().min(1, "Player is required"),
      })
    ),
  })
  .check((ctx) => {
    const total = ctx.value.points.reduce((acc, item) => acc + item.point, 0);
    if (total !== 0) {
      ctx.issues.push({
        code: "custom",
        message: "Total must be 0",
        input: ctx.value,
        path: ["points"],
      });
    }
  });

export type FreeCardRecordFormSchema = z.infer<typeof formSchema>;

export const FreeCardFormAddRecord: FC<{ users: string[] }> = ({ users }) => {
  const form = useForm<FreeCardRecordFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: users.map((user) => ({
        player: user,
        point: 0,
      })),
    },
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: "points",
  });
  const [isPending, startTransition] = useTransition();
  const submit = useSubmit();

  return (
    <Form {...form}>
      <RRForm
        method="post"
        onSubmit={form.handleSubmit((values) => {
          startTransition(async () => {
            await submit(values, {
              method: "post",
              encType: "application/json",
            });
            form.reset();
          });
        })}
      >
        <div className="flex gap-3 flex-col p-3 rounded-lg mt-5 shadow-xl border border-gray-100">
          {fields.map((field, index) => (
            <div key={`field-${field.id}-${index}`}>
              <FormField
                control={form.control}
                name={`points.${index}.player`}
                render={({ field }) => (
                  <FormItem>
                    <input type="hidden" {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`points.${index}.point`}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-end gap-2">
                    <FormLabel className="">{users[index]}</FormLabel>
                    <FormControl>
                      <div className="w-2/3">
                        <InputVirtualKeyboard
                          name={field.name}
                          value={field.value}
                          onChangeValue={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          {form.formState.errors.points?.root?.message && (
            <div className="text-red-500">
              {form.formState.errors.points?.root?.message}
            </div>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add Record"}
          </Button>
        </div>
      </RRForm>
    </Form>
  );
};
