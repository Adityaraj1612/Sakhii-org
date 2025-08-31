
const Testimonial = () => {
    const cardsData = [
        {
  name: "Priya Ramaswamy",
  city: "Mumbai",
  initials: "PR",
  review:
    "Sakhi has transformed how I understand my body. The period tracker is incredibly accurate, and the educational resources have taught me...",
},
{
  name: "Susmita",
  city: "Delhi",
  initials: "SM",
  review:
    "Being able to consult with doctors in my native language has been life-changing. Sakhi provides a safe space for women like me to discuss health c...",
},
{
  name: "Sunita Mehta",
  city: "Delhi",
  initials: "SM",
  review:
    "The community support on Sakhi helped me through a difficult pregnancy. I found information and emotional support that wasn't availabl...",
},
    ];

    const CreateCard = ({ card }) => (
        <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg hover:scale-110 transition-transform duration-200 w-72 shrink-0 border border-[#CA3561]/40">
            <p className="text-rose-500 text-lg mb-2">★★★★★</p>
             <p className="text-gray-700 text-sm mb-4">{card.review}</p>
             <div className="flex items-center gap-3">
               <div className="bg-rose-100 text-rose-500 font-semibold rounded-full w-10 h-10 flex items-center justify-center">
                 {card.name.slice(0,2).toUpperCase()}
               </div>
               <div>
                 <p className="font-medium text-gray-900">{card.name}</p>
                 <p className="text-sm text-gray-500">{card.city}</p>
               </div>
             </div>
            
        </div>
    );

    return (
        <>
            <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>
             <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 ">
         What Other Women Say About Us !       </h2>
            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative mb-5">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5 ">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card}  />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>

        </>
    )
}
export default Testimonial