"use client"; 
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { supabase } from '@/services/supabaseClient';
import React, { useContext, useEffect, useState} from 'react';

function Provider({children}) {
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // listen for auth state changes (login/logout) and fetch the user record
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) {
                    fetchOrCreateUser(session.user);
                } else {
                    setUser(undefined);
                }
            }
        );

        // on component mount also try to load existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchOrCreateUser(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchOrCreateUser = async (supabaseUser) => {
        if (!supabaseUser?.email) return;

        console.log('fetchOrCreateUser triggered for', supabaseUser);

        // look for existing user in our "Users" table
        const { data: existing, error: fetchError } = await supabase
            .from('Users')
            .select('*')
            .eq('email', supabaseUser.email)
            .maybeSingle();

        if (fetchError) {
            console.error('Error fetching user from table:', fetchError);
            setUser(null);
            setLoading(false);
            return;
        }

        if (existing) {
            console.log('existing user found', existing);
            // guarantee we have name for display
            const named = {
                ...existing,
                name: existing.name || supabaseUser.email,
            };
            setUser(named);
            setLoading(false);
            return;
        }

        // insert a new record and return the single row
        const name =
            supabaseUser.user_metadata?.name ||
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.email;
        const picture =
            supabaseUser.user_metadata?.picture ||
            supabaseUser.user_metadata?.avatar_url ||
            null;

        const { data: inserted, error: insertError } = await supabase
            .from('Users')
            .insert({
                name,
                email: supabaseUser.email,
                picture,
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting user into table:', insertError);
            setUser(null);
            setLoading(false);
            return;
        }

        console.log('new user inserted', inserted);
        setUser(inserted);
        setLoading(false);
    };
    return (
        <UserDetailsContext.Provider value={{user,setUser,loading}}>
            <div>{children}</div>
        </UserDetailsContext.Provider>
        
    )
}
export default Provider;

export const useUser=()=>{
    const context=useContext(UserDetailsContext);
    return context;
}