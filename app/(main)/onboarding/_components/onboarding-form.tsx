"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUserMutate } from "@/Tanstack-Query/useUserMutate";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { industries } from "@/data/industries";

// Zod schema with numeric validation for experience
const formSchema = z.object({
  industry: z.string().min(1, { message: "Please select an industry" }),
  specialization: z
    .string()
    .min(1, { message: "Please select a specialization" })
    .optional(),
  experience: z.string().min(1, { message: "Please enter your experience" }),
  skills: z.string().min(1, { message: "Please enter at least one skill" }),
  bio: z.string().optional(),
});

export default function OnBoardingForm() {
  const router = useRouter();

  // Form initialization
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      specialization: "",
      experience: "",
      skills: "",
      bio: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useUserMutate();

  // Watch industry field to dynamically load specializations
  const watchIndustry = form.watch("industry");

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    const skillsArray = values.skills.split(",").map((s) => s.trim());
    const formattedIndustry = `${values.industry}-${
      values.specialization?.toLowerCase().replace(/ /g, "-") || ""
    }`;
    mutate({
      ...values,
      bio: values.bio || "",
      industry: formattedIndustry,
      skills: skillsArray,
    });
    router.push("/dashboard");
  }

  // Find subIndustries based on selected industry
  const selectedIndustry = industries.find((ind) => ind.id === watchIndustry);
  const subIndustries = selectedIndustry ? selectedIndustry.subIndustries : [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl mx-auto border rounded-2xl p-10"
      >
        <div>
          <h1 className="text-4xl gradient-title font-bold text-center">
            Complete your profile
          </h1>
          <p className="text-muted-foreground text-center">
            Select your industry to get personalized career insights and
            recommendations
          </p>
        </div>

        {/* Industry Field */}
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specialization Field (Dynamic based on industry) */}
        {watchIndustry && (
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a specialization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subIndustries.map((subIndustry) => (
                      <SelectItem key={subIndustry} value={subIndustry}>
                        {subIndustry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Experience Field */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 5" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Skills Field */}
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., python, java, project management"
                  type="text"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio Field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell about your professional background"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}
