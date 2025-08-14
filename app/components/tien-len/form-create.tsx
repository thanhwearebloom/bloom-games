import { useMemo, type FC } from "react";
import { Form as RRForm, useNavigation, useSubmit } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import CreatableSelect from "react-select/creatable";

export const TienLenFormSchema = z.object({
  playerA: z.string("Player A is required").min(1, "Player A is required"),
  playerB: z.string("Player B is required").min(1, "Player B is required"),
  playerC: z.string("Player C is required").min(1, "Player C is required"),
  playerD: z.string("Player D is required").min(1, "Player D is required"),
});

type TienLenFormValues = z.infer<typeof TienLenFormSchema>;

export const TienLenFormCreate: FC<{
  users: { uid: string; displayName: string }[];
}> = ({ users }) => {
  const form = useForm<TienLenFormValues>({
    resolver: zodResolver(TienLenFormSchema),
    defaultValues: {
      playerA: "",
      playerB: "",
      playerC: "",
      playerD: "",
    },
  });
  const submit = useSubmit();
  const navigation = useNavigation();
  const options = useMemo(() => {
    return users.map((user) => ({
      value: user.displayName,
      label: user.displayName,
    }));
  }, [users]);
  return (
    <Form {...form}>
      <RRForm
        method="post"
        onSubmit={form.handleSubmit((values) => {
          submit(values, {
            method: "post",
            encType: "multipart/form-data",
          });
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>New Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <FormField
                name="playerA"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex space-x-3 items-center">
                      <FormLabel>Player A</FormLabel>
                      <div className="grow">
                        <FormControl>
                          <CreatableSelect<{ value: string; label: string }>
                            isClearable
                            options={options}
                            value={
                              field.value
                                ? { value: field.value, label: field.value }
                                : undefined
                            }
                            onChange={(value) => {
                              field.onChange(value?.value);
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="playerB"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex space-x-3 items-center">
                      <FormLabel>Player B</FormLabel>
                      <div className="grow">
                        <FormControl>
                          <CreatableSelect<{ value: string; label: string }>
                            isClearable
                            options={options}
                            value={
                              field.value
                                ? { value: field.value, label: field.value }
                                : undefined
                            }
                            onChange={(value) => {
                              field.onChange(value?.value);
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="playerC"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex space-x-3 items-center">
                      <FormLabel>Player C</FormLabel>
                      <div className="grow">
                        <FormControl>
                          <CreatableSelect<{ value: string; label: string }>
                            isClearable
                            options={options}
                            value={
                              field.value
                                ? { value: field.value, label: field.value }
                                : undefined
                            }
                            onChange={(value) => {
                              field.onChange(value?.value);
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="playerD"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex space-x-3 items-center">
                      <FormLabel>Player D</FormLabel>
                      <div className="grow">
                        <FormControl>
                          <CreatableSelect<{ value: string; label: string }>
                            isClearable
                            options={options}
                            value={
                              field.value
                                ? { value: field.value, label: field.value }
                                : undefined
                            }
                            onChange={(value) => {
                              field.onChange(value?.value);
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Creating..." : "Start"}
            </Button>
          </CardFooter>
        </Card>
      </RRForm>
    </Form>
  );
};
