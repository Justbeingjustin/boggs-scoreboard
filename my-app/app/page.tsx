"use client";
import Image from "next/image";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ABjjPlLjI5G
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader, CardContent, Card, CardFooter } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/Loader";
declare global {
  class Castjs {
    available: boolean;
    cast(url: string, options: any): void;
  }
}
export default function Component() {
  const [name, setName] = useState('');
  const [beers, setBeers] = useState('');
  const [players, setPlayers] = useState<{ name: string; beers: string; }[]>([]);
  const [loading, setLoading] = useState(false);

  const [url, setURL] = useState('');

  const [castjs, setCastjs] = useState<any>(null); // State to hold the Castjs instance


  const addPlayer = () => {
    if (name && beers) {
      setPlayers([...players, { name, beers }]);
      setName('');
      setBeers('');
    }
  };

  const clearScoreboard = () => {
    setURL('');
    setPlayers([]);
  };

  const castScoreboard = async () => {
    if (castjs && castjs.available) {
      castjs.cast(url, {
        poster: 'https://castjs.io/media/poster.jpg',
        title: 'Boggs Scoreboard',
        description: 'Created by Justin Gerber',
        subtitles: [{
          active: true,
          label: 'English',
          src: 'https://castjs.io/media/english.vtt'
        }, {
          label: 'Spanish',
          src: 'https://castjs.io/media/spanish.vtt'
        }]
      });
    } else {
      console.log('Casting is not available');
    }
  }

  const createScoreboard = async () => {
    setLoading(true);
    const request = {
      ScoreRows: players.map(player => ({
        Name: player.name,
        Score: player.beers
      }))
    };

    try {
      const response = await fetch('/api/createScoreboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to create scoreboard');
      }

      const payload = await response.json();
      console.log(payload);

      setLoading(false);
      setURL(payload.url);




    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('Failed to create scoreboard');
    }
  };

  useEffect(() => {
    console.log('Component mounted');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/castjs/5.3.0/cast.min.js';
    script.onload = () => {
      console.log('Cast.js has been loaded successfully');
      setCastjs(new Castjs()); // Set the Castjs instance in state
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      console.log('Cleanup script and instance');
    };
  }, []);

  // Sorting players by beers in descending order
  const sortedPlayers = [...players].sort((a, b) => Number(b.beers) - Number(a.beers));
  return (
    <>

      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black">
        <nav className="container mx-auto flex h-full items-center justify-between px-4">
          <Link className="text-xl font-bold text-white" href="#">
            Boggs Scoreboard
          </Link>
        </nav>
      </header>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-10">
          <Loader />
        </div>
      )}
      <main className="container mx-auto mt-20 max-w-3xl px-4">
        <section className="py-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">Welcome to the Boggs Scoreboard</h1>
          <p className="text-gray-600">

            This was loosely inspired by season 10 episode 1 of It&apos;s Always Sunny in Philadelphia. The gang tries to beat a record set by Wade Boggs of 70 drinks on a cross-country flight. The Boggs Scoreboard should be used as a tool to stop overconsumption of alcohol.

          </p>


        </section>

        <section className="py-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">Instructions</h1>

          <p className="text-gray-600">
            This will use google chromecast to cast the scoreboard to a television. Click the add button to add player(s) to the scoreboard. Then click the cast to Tv button.
          </p>
        </section>


        <section className="py-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Add Player</h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="w-full md:w-1/3" placeholder="Name" type="text" />
            <Input value={beers} onChange={(e) => setBeers(e.target.value)} className="w-full md:w-1/3" placeholder="Number of Beers" type="number" />
            <Button onClick={addPlayer} className="w-full md:w-1/3">Add</Button>
          </div>
        </section>
        {players.length > 0 && !url && (
          <section className="py-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Scoreboard</h2>
            <Card>
              <CardHeader>
                <CardTitle>Top Scores</CardTitle>

              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPlayers.map((player, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {player.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="border-green-600 bg-white dark:bg-gray-950" variant="outline">
                            {player.beers}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button onClick={clearScoreboard}>Reset</Button>
                <Button onClick={createScoreboard}>Create</Button>

              </CardFooter>
            </Card>
          </section>
        )}
        {url && (
          <section className="py-12">
            <Card>
              <CardHeader>
                <CardTitle>Scoreboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2">
                  <img src={url} alt="Scoreboard GIF" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button onClick={clearScoreboard}>Reset</Button>
                <Button onClick={castScoreboard}>Cast to Tv</Button>
              </CardFooter>
            </Card>
          </section>
        )}
      </main >
    </>
  );
}


function CircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}