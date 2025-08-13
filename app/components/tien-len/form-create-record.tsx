import { useCallback, useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { Form as RRForm, useNavigation, useSubmit } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BrushCleaning } from "lucide-react";
import { InputVirtualKeyboard } from "../shared/input-virtual-keyboard";

export const TienLenFormCreateRecordSchema = z
  .object({
    playerA: z.number().optional(),
    playerB: z.number().optional(),
    playerC: z.number().optional(),
    playerD: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      typeof data.playerA === "number" &&
      typeof data.playerB === "number" &&
      typeof data.playerC === "number" &&
      typeof data.playerD === "number"
    ) {
      if (data.playerA + data.playerB + data.playerC + data.playerD !== 0) {
        ctx.addIssue({
          code: "custom",
          message: "Total must be 0",
          path: ["playerA", "playerB", "playerC", "playerD"],
        });
      }
    }
    if (!data.playerA && !data.playerB && !data.playerC && !data.playerD) {
      ctx.addIssue({
        code: "custom",
        message: "All fields are required",
        path: ["playerA", "playerB", "playerC", "playerD"],
      });
    }
  });

type TienLenFormCreateRecordValues = z.infer<
  typeof TienLenFormCreateRecordSchema
>;

export const TienLenFormCreateRecord: FC<{
  playerA: string;
  playerB: string;
  playerC: string;
  playerD: string;
}> = ({ playerA, playerB, playerC, playerD }) => {
  const form = useForm<TienLenFormCreateRecordValues>({
    resolver: zodResolver(TienLenFormCreateRecordSchema),
  });
  const submit = useSubmit();
  const navigation = useNavigation();
  const watchA = form.watch("playerA");
  const watchB = form.watch("playerB");
  const watchC = form.watch("playerC");
  const watchD = form.watch("playerD");
  const isZero = useMemo(() => {
    if (
      typeof watchA !== "number" ||
      typeof watchB !== "number" ||
      typeof watchC !== "number" ||
      typeof watchD !== "number"
    ) {
      return false;
    }
    return watchA + watchB + watchC + watchD === 0;
  }, [watchA, watchB, watchC, watchD]);

  const blurHandler = useCallback(() => {
    const playerA = form.getValues("playerA");
    const playerB = form.getValues("playerB");
    const playerC = form.getValues("playerC");
    const playerD = form.getValues("playerD");
    // if 3 in 4 fields playerA/B/C/D are filled after focusing out, auto fill the remaning field
    if (
      typeof playerA === "number" &&
      typeof playerB === "number" &&
      typeof playerC === "number" &&
      typeof playerD === "number"
    ) {
      return;
    }
    if (
      typeof playerA === "number" &&
      typeof playerB === "number" &&
      typeof playerC === "number"
    ) {
      form.setValue("playerD", 0 - (playerA + playerB + playerC));
    }
    if (
      typeof playerA === "number" &&
      typeof playerB === "number" &&
      typeof playerD === "number"
    ) {
      form.setValue("playerC", 0 - (playerA + playerB + playerD));
    }
    if (
      typeof playerA === "number" &&
      typeof playerC === "number" &&
      typeof playerD === "number"
    ) {
      form.setValue("playerB", 0 - (playerA + playerC + playerD));
    }
    if (
      typeof playerB === "number" &&
      typeof playerC === "number" &&
      typeof playerD === "number"
    ) {
      form.setValue("playerA", 0 - (playerB + playerC + playerD));
    }
  }, [form]);

  const whiteWin = useCallback(
    (field: "playerA" | "playerB" | "playerC" | "playerD") => {
      // white win means, if playerA is white win, playerA should have 39 points, other players should hoave -13
      form.setValue("playerA", field === "playerA" ? 39 : -13);
      form.setValue("playerB", field === "playerB" ? 39 : -13);
      form.setValue("playerC", field === "playerC" ? 39 : -13);
      form.setValue("playerD", field === "playerD" ? 39 : -13);
    },
    [form]
  );

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
            playerA: undefined,
            playerB: undefined,
            playerC: undefined,
            playerD: undefined,
          });
        })}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-5 space-x-3">
            <div className="space-y-2 flex flex-col justify-end">
              <FormField
                control={form.control}
                name="playerA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{playerA}</FormLabel>
                    <FormControl>
                      <InputVirtualKeyboard
                        value={field.value}
                        onChangeValue={field.onChange}
                        onClose={blurHandler}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => whiteWin("playerA")}
                className="w-full"
              >
                WW
              </Button>
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <FormField
                control={form.control}
                name="playerB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{playerB}</FormLabel>
                    <FormControl>
                      <InputVirtualKeyboard
                        value={field.value}
                        onChangeValue={field.onChange}
                        onClose={blurHandler}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => whiteWin("playerB")}
                className="w-full"
              >
                WW
              </Button>
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <FormField
                control={form.control}
                name="playerC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{playerC}</FormLabel>
                    <FormControl>
                      <InputVirtualKeyboard
                        value={field.value}
                        onChangeValue={field.onChange}
                        onClose={blurHandler}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => whiteWin("playerC")}
                className="w-full"
              >
                WW
              </Button>
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <FormField
                control={form.control}
                name="playerD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{playerD}</FormLabel>
                    <FormControl>
                      <InputVirtualKeyboard
                        value={field.value}
                        onChangeValue={field.onChange}
                        onClose={blurHandler}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant={"outline"}
                onClick={() => whiteWin("playerD")}
                className="w-full"
              >
                WW
              </Button>
            </div>
            <div className="flex flex-col justify-end">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => form.reset()}
              >
                <BrushCleaning />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={navigation.state === "submitting" || !isZero}
          >
            Submit
          </Button>
        </div>
      </RRForm>
    </Form>
  );
};
