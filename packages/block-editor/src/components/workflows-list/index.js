/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockTypesList from '../block-types-list';

function Workflow() {
	return 'test';
}

export default function WorkflowsList( props ) {
	const [ activeWorkflow, setActiveWorkflow ] = useState();

	return (
		<>
			<BlockTypesList
				{ ...props }
				onSelect={ ( workflow ) => {
					setActiveWorkflow( workflow );
				} }
			/>
			{ !! activeWorkflow && (
				<Workflow
					workflow={ activeWorkflow }
					onFinish={ () => setActiveWorkflow( undefined ) }
				/>
			) }
		</>
	);
}
