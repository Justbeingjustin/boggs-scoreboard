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

export default function Component() {
  const [name, setName] = useState('');
  const [beers, setBeers] = useState('');
  const [players, setPlayers] = useState<{ name: string; beers: string; }[]>([]);

  const addPlayer = () => {
    if (name && beers) {
      setPlayers([...players, { name, beers }]);
      setName('');
      setBeers('');
    }
  };

  const clearScoreboard = () => {
    setPlayers([]);
  };

  const createScoreboard = () => {

  };

  useEffect(() => {
    console.log('Component mounted');
    // Dynamically load the cast.js script
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/castjs/5.3.0/cast.min.js';
    script.onload = () => {
      // Script has loaded
      console.log('Cast.js has been loaded successfully');

      // Create new Castjs instance after the script is loaded
      const cjs = new Castjs();

      console.log("2")

      // Setup event listener on the button
      document.getElementById('cast').addEventListener('click', () => {
        if (cjs.available) {
          // Cast a video with additional options
          cjs.cast('https://pro-pixelgreet-images.s3.amazonaws.com/profile-pictures/10279_3.jpg', {
            poster: 'https://castjs.io/media/poster.jpg',
            title: 'Sintel',
            description: 'Third Open Movie by Blender Foundation',
            subtitles: [{
              active: true,
              label: 'English',
              src: 'https://castjs.io/media/english.vtt'
            }, {
              label: 'Spanish',
              src: 'https://castjs.io/media/spanish.vtt'
            }],
          });
        } else {
          console.log('Casting is not available');
        }
      });
    };
    document.body.appendChild(script);

    // Cleanup function to remove script and event listener
    return () => {
      document.body.removeChild(script);
      // document.getElementById('cast')?.removeEventListener('click', handleClick);
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
      <main className="container mx-auto mt-20 max-w-3xl px-4">
        <section className="py-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">Welcome</h1>
          <p className="text-gray-600">
            Our mission is to be the world's leading software for drinking scoreboards and to stop overconsumption.
            Stop keeping track of how much each person has had to drink in your head. Use the Boggs Scoreboard today to stop overconsumption!
          </p>
        </section>
        <button id="cast">Cast23</button>
        <section className="py-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Add Player</h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="w-full md:w-1/3" placeholder="Name" type="text" />
            <Input value={beers} onChange={(e) => setBeers(e.target.value)} className="w-full md:w-1/3" placeholder="Number of Beers" type="number" />
            <Button onClick={addPlayer} className="w-full md:w-1/3">Add</Button>
          </div>
        </section>
        {players.length > 0 && (
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
                <Button onClick={clearScoreboard}>Clear</Button>
                <Button onClick={createScoreboard}>Create Scoreboard</Button>
              </CardFooter>
            </Card>
          </section>
        )}
      </main>
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