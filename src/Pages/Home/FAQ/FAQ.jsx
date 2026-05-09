

const s = () => {
    const QAs = [
      {
        question: "How does this posture corrector work?",
        answer:
          "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
      },
      {
        question: "Is it suitable for all ages and body types?",
        answer:
          "Posture Pro works by using sensors to monitor your posture throughout the day. When it detects that you are slouching or have poor posture, it sends gentle vibrations or notifications to remind you to correct your posture. This helps you develop better habits and maintain proper alignment over time.",
      },
      {
        question: "Does it really help with back pain and posture improvement?",
        answer:
          "Posture Pro is generally suitable for most individuals, but it's always a good idea to consult with a healthcare professional before using any posture correction device, especially if you have pre-existing medical conditions or spinal issues.",
      },
      {
        question: "Does it have smart features like vibration alerts?",
        answer:
          "The recommended duration for wearing Posture Pro can vary based on individual needs and comfort levels. It's often suggested to start with shorter periods, such as 15-30 minutes a day, and gradually increase the duration as you become more accustomed to the device.",
      },
      {
        question: "How will I be notified when the product is back in stock?",
        answer:
          "Posture Pro can potentially help alleviate back pain by encouraging proper posture and reducing strain on the spine. However, it's important to address any underlying causes of back pain and consult with a healthcare professional for a comprehensive treatment plan.",
      },
    ];
    return (
      <div>
        <h1>Frequently Asked Question (FAQ)</h1>
        <p>
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>

        <div>
          {QAs.map((qa, index) => (
            <div key={index}>
              <h2>{qa.question}</h2>
              <p>{qa.answer}</p>
            </div>
          ))}
        </div>

        


      </div>
    );
};

export default s;