"use client";

import { features } from "@/data/features";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { Button } from "../ui/button";

export function FeaturesSection() {
  return (
    <section className=" bg-background   mt-10">
      <h1 className="capitalize text-center py-10 text-4xl font-bold ">
        Powerful features for your career growth
      </h1>
      <div className="flex items-center flex-wrap justify-between px-14 overflow-hidden">
        {features.map((feature, index) => (
          <CardContainer className="inter-var" key={index}>
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] max-h-[350px] rounded-xl p-6 border flex flex-col justify-between  ">
              <CardItem
                translateZ="120"
                rotateX={10}
                rotateZ={0}
                className="w-full mt-4"
              >
                <span>{feature.icon}</span>
              </CardItem>
              <CardItem
                translateZ="40"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {feature.title}
              </CardItem>
              <CardItem
                as="p"
                translateZ="50"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                {feature.description}
              </CardItem>

              <div className="flex justify-between items-center mt-20">
                <CardItem
                  translateZ={20}
                  translateX={-40}
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  <Button> Try now →</Button>
                </CardItem> 
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </section>
  );
}
