
import { useState } from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

function useApiFetcher({path, method}) {
    
    const [results, setResults] = useState();
    const [pending, setPending] = useState( null );
    
    async function exec({ data } = {}) {
        if (pending !== null) {
            pending.controller?.abort();
        }
        
        const controller = typeof AbortController === 'undefined' ? 
            undefined : 
            new AbortController();

        const signal = controller?.signal;
        const request = apiFetch( { path, method, data, signal } );
        setPending({request, controller});
        const results = await request;
        setResults(results);
        setPending(null);
    }
    
    const isPending = (pending !== null);
    
    return { results, exec, isPending }
    
}

function useGroupsLoader({ namespace }) {
    
    const path = addQueryArgs( '/scheduler_widget/v1/groups', { namespace } );
    const method = 'GET';
    
    const { results, ...others } = useApiFetcher({ path, method });
    return {
        results: results ? results['groups'] : [],
        ...others
    }
    
}

function useGroupsSaver({ namespace }) {
    
    const path = addQueryArgs( '/scheduler_widget/v1/groups', { namespace } );
    const method = 'POST';
    
    const { results, exec, ...others } = useApiFetcher({ path, method });
    return {
        results: results ? results['groups'] : [],
        exec: function(vars) {
            const data = {groups: vars.data};
            return exec({...vars, data});
        },
        ...others
    }
    
}

export { useGroupsLoader, useGroupsSaver };