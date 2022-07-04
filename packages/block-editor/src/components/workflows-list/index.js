/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockTypesList from '../block-types-list';

function Workflow( { rootClientId, workflow, onFinish } ) {
	const { flow: Component } = workflow;
	return (
		<Component
			rootClientId={ rootClientId }
			workflow={ workflow }
			onFinish={ onFinish }
		/>
	);
}

export default function WorkflowsList( props ) {
	const [ activeWorkflow, setActiveWorkflow ] = useState();
	const { rootClientId } = props;

	return (
		<>
			<BlockTypesList
				{ ...props }
				onSelect={ ( workflow ) => {
					setActiveWorkflow( workflow );
				} }
				isDraggable={ false }
			/>
			{ !! activeWorkflow && (
				<Workflow
					rootClientId={ rootClientId }
					workflow={ activeWorkflow }
					onFinish={ () => setActiveWorkflow( undefined ) }
				/>
			) }
		</>
	);
}
