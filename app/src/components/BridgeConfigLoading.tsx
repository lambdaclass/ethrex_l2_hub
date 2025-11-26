interface BridgeConfigLoadingProps {
	error: string | null;
}

export const BridgeConfigLoading = ({ error }: BridgeConfigLoadingProps) => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
			<div className="text-center">
				<h2 className="mt-6 text-2xl font-semibold text-gray-900">
					Waiting for L1 Bridge Contract Deployment...
				</h2>
				<p className="mt-2 text-sm text-gray-600">
					The application is connecting to the L1 network to fetch bridge configuration.
				</p>
				<p className="mt-1 text-sm text-gray-600">
					This may take a few moments while the bridge contract is being deployed.
				</p>
				{error && (
					<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md max-w-md mx-auto">
						<p className="text-xs text-yellow-800">
							<span className="font-medium">Retrying...</span> {error}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
