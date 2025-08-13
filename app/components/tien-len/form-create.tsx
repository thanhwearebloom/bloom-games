import type { FC } from "react";
import { Form as RRForm, useNavigation, useSubmit } from "react-router";
import { Typeahead } from "@/components/shared/typeahead";
import { Label } from "@/components/ui/label";
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

export const TienLenFormSchema = z.object({
  playerA: z.string().min(1, "Player A is required"),
  playerB: z.string().min(1, "Player B is required"),
  playerC: z.string().min(1, "Player C is required"),
  playerD: z.string().min(1, "Player D is required"),
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
                          <Typeahead
                            items={users.map((user) => user.displayName)}
                            {...field}
                            onValueChange={field.onChange}
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
                          <Typeahead
                            items={users.map((user) => user.displayName)}
                            {...field}
                            onValueChange={field.onChange}
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
                          <Typeahead
                            items={users.map((user) => user.displayName)}
                            {...field}
                            onValueChange={field.onChange}
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
                          <Typeahead
                            items={users.map((user) => user.displayName)}
                            {...field}
                            onValueChange={field.onChange}
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
