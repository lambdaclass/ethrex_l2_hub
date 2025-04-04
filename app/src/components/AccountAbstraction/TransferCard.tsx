export default function TransferCard() {
  return (
    <div className="example">
      <p className="text-lg text-gray-800">
        <span className="font-bold text-2xl text-blue-600">3</span>. Transfer
        tokens
      </p>

      <hr className="border-gray-300 my-4" />

      <div className="space-y-4 mt-4 max-w-md">
        <input
          type="text"
          placeholder="Recipient Address"
          className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Amount"
            className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
