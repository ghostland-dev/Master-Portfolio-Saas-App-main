"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, Clock, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase as supabaseClient } from "@/lib/supabase"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTag, setSelectedTag] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabaseClient
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false })

        if (error) {
          console.error("Error fetching blog posts:", error)
        } else {
          setPosts(data || [])
        }
      } catch (err) {
        console.error("Unexpected error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  // Get all unique categories and tags from fetched posts
  const allCategories = Array.from(new Set(posts.flatMap((post) => post.categories || [])))
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])))

  // Filter posts based on search, category, and tag
  const filteredPosts = posts.filter((post) => {
    const title = post.title || ""
    const excerpt = post.excerpt || ""

    const matchesSearch =
      searchQuery === "" ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || (post.categories || []).includes(selectedCategory)

    const matchesTag = selectedTag === "" || (post.tags || []).includes(selectedTag)

    return matchesSearch && matchesCategory && matchesTag
  })

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
          Articles, tutoriels et réflexions sur le développement, DevOps et les technologies web
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-3/4">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher des articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
              <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50">
                <TabsTrigger value="all">Tous</TabsTrigger>
                {allCategories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden border-muted/20 hover:border-primary/50 transition-colors">
                  <div className="md:flex">
                    <div className="relative h-60 md:h-auto md:w-1/3">
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(post.categories || []).map((category: string) => (
                          <Badge key={category} variant="secondary" className="capitalize">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(post.published_at).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {post.read_time_minutes} min de lecture
                        </span>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou de revenir plus tard pour de nouveaux contenus.
              </p>
            </div>
          )}
        </div>

        <div className="md:w-1/4 space-y-8">
          <Card className="border-muted/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Tags populaires</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer capitalize hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Articles récents</h3>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-2 text-sm leading-tight">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(post.published_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 border-t border-muted/20">
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/blog">Voir tous les articles</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-muted/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Abonnez-vous pour recevoir mes derniers articles et actualités directement dans votre boîte mail.
              </p>
              <Input placeholder="Votre adresse email" type="email" className="mb-4 bg-background" />
              <Button className="w-full">S'abonner</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
