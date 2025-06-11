import Header from '../components/Header';

export default function Contact() {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('striveUser')) : null;

  return (
    <div className="min-h-screen bg-white text-black">
      <Header user={user} />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">Contact Us</h1>
          <p className="text-gray-700 text-lg">
            Got a question, idea, or bit of feedback? We’d love to hear from you.
            Reach out to the Strive team and we’ll be back to you as soon as possible!
          </p>
          <p className="text-gray-600 mt-4">Email: support@strive.ie</p>
        </div>
      </div>
    </div>
  );
}
  