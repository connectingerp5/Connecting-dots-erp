import { Barlow_Condensed } from "next/font/google";
import Image from "next/image";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});
export default function HeaderCarouselAug(){
    return(
        <div className="w-full max-w-[1800px] h-svh bg-red-500">
            <div className="relative sm:hidden w-full">
                    {/* Image — normal flow, w-full h-auto means it scales by its own
                        intrinsic aspect ratio and the container height follows it */}
                    <Image
                      src="/mobileAug.png"
                      alt="AI powered learning, SAP industry standard, smart assessments, personalized roadmap"
                      width={1200}
                      height={1500}
                      className="w-full h-auto"
                      priority
                    />
            
                    {/* Scrim for text readability regardless of what's under the panel */}
                    <div className="absolute inset-0 bg-black/10" />
            
                    {/* Glassmorphic hero text panel — overlaid on the image */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-start p-3 xs:px-4">
                      <div className=" p-3 xs:p-3">
                        <div className="inline-flex max-w-full py-2 items-center gap-2 rounded-full bg-white/90 px-2 xs:px-3.5 xs:py-2 shadow-sm ring-1 ring-purple-100 backdrop-blur-sm">
                          <span className="min-w-0 text-[11px] xs:text-xs font-semibold text-gray-800">
                            India&apos;s Leading SAP &amp; IT Training with AI Institute
                          </span>
                        </div>
            
                        <h1
                          className={`${barlow.className} heroHeading relative mt-3 text-[30px] xs:text-[36px] leading-[0.95] xs:leading-[0.9] font-extrabold uppercase tracking-[0.05em] text-[#1b3a6d]`}
                        >
                          From <span className="font-normal">&#x22;</span>Just applying<span className="font-normal">&#x22;</span> to
                          <br />
                          <span className="bg-gradient-to-r from-[#ff9a3d] via-[#ff5b7b] to-[#b17dff] bg-clip-text text-transparent">
                            <span className="font-normal">&#x22;</span>just got hired<span className="font-normal">&#x22;</span>
                          </span>
                          <br />
                        </h1>
            
                        <style jsx>{`
                          /* Underline */
                            .heroHeading::after {
                              content: "";
                              position: absolute;
                              left: 0;
                              bottom: -18px;
                              width: 90px;
                              height: 5px;
                              border-radius: 999px;
                              background: linear-gradient(
                                90deg,
                                #ff9f43 0%,
                                #ff5e62 50%,
                                #b16cea 100%
                              );
                            }
                        `}</style>
            
                        <p className="mt-4 text-[14px] xs:text-[15px] leading-relaxed text-gray-800">
                          Real SAP, IT & HR training — taught by people who've done the job.
                          Online or offline batches, built around your schedule.
                        </p>
            
                        <div className="mt-6 flex items-center gap-3">
                          <ConsultationButton onOpenForm={onOpenForm} />
                          <button className="rounded-xl w-full md:w-auto lg:w-auto xl:w-auto text-xs md:text-lg lg:text-lg xl:text-xl border border-blue-600 px-3 py-2.5 capitalize text-[#1b3a6d] bg-white/70 backdrop-blur-sm">
                            Book a free demo class
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
        </div>
    )
}