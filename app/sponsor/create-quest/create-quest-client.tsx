"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Plus, Trash, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAccount } from "@starknet-react/core"
import { useContract } from "@/lib/contract-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CreateQuestClient() {
  const router = useRouter()
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const { createQuest } = useContract()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    criteria: "",
    difficulty: "Easy",
    estimatedTime: "",
    xpReward: 100,
    steps: [""],
    badgeImage: null as File | null,
    badgeName: "",
    badgeDescription: "",
  })

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to home if not connected
  useEffect(() => {
    if (mounted && !isConnected) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to access the sponsor dashboard.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [isConnected, router, mounted, toast])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle step changes
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps]
    newSteps[index] = value
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  // Add new step
  const addStep = () => {
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, ""] }))
  }

  // Remove step
  const removeStep = (index: number) => {
    const newSteps = [...formData.steps]
    newSteps.splice(index, 1)
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, badgeImage: e.target.files![0] }))
    }
  }

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a quest title.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.description.trim()) {
      toast({
        title: "Missing Description",
        description: "Please enter a quest description.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.criteria.trim()) {
      toast({
        title: "Missing Criteria",
        description: "Please enter completion criteria.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.estimatedTime.trim()) {
      toast({
        title: "Missing Time Estimate",
        description: "Please enter an estimated completion time.",
        variant: "destructive",
      })
      return false
    }

    if (formData.steps.some((step) => !step.trim())) {
      toast({
        title: "Empty Steps",
        description: "Please fill in all quest steps or remove empty ones.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.badgeName.trim()) {
      toast({
        title: "Missing Badge Name",
        description: "Please enter a name for the badge reward.",
        variant: "destructive",
      })
      return false
    }

    if (!formData.badgeImage) {
      toast({
        title: "Missing Badge Image",
        description: "Please upload an image for the badge reward.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setShowConfirmDialog(true)
  }

  // Handle quest creation
  const handleCreateQuest = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a quest.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Create quest metadata
      const questMetadata = {
        title: formData.title,
        description: formData.description,
        criteria: formData.criteria,
        difficulty: formData.difficulty,
        estimatedTime: formData.estimatedTime,
        xpReward: Number(formData.xpReward),
        steps: formData.steps,
        badge: {
          name: formData.badgeName,
          description: formData.badgeDescription,
          imageUrl: formData.badgeImage ? URL.createObjectURL(formData.badgeImage) : "",
        },
      }

      // In a real implementation, this would upload the image to IPFS and create a quest on the blockchain
      await createQuest(questMetadata)

      toast({
        title: "Quest Created",
        description: "Your quest has been created successfully.",
      })

      // Redirect to sponsor dashboard
      router.push("/sponsor")
    } catch (error) {
      console.error("Failed to create quest:", error)
      toast({
        title: "Creation Failed",
        description: "Failed to create quest. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || !isConnected) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/sponsor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sponsor Dashboard
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Quest</CardTitle>
                <CardDescription>Create a new quest for users to complete and earn badges</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quest Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Starknet Explorer"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Quest Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what users will learn or accomplish in this quest"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="criteria">Completion Criteria</Label>
                    <Textarea
                      id="criteria"
                      name="criteria"
                      placeholder="Describe what users need to do to complete this quest"
                      value={formData.criteria}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => handleSelectChange("difficulty", value)}
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedTime">Estimated Time</Label>
                      <Input
                        id="estimatedTime"
                        name="estimatedTime"
                        placeholder="e.g., 15 minutes"
                        value={formData.estimatedTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="xpReward">XP Reward</Label>
                      <Input
                        id="xpReward"
                        name="xpReward"
                        type="number"
                        min="1"
                        value={formData.xpReward}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Quest Steps</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addStep}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    </div>
                    {formData.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground flex-shrink-0">
                          {index + 1}
                        </div>
                        <Input
                          placeholder={`Step ${index + 1}`}
                          value={step}
                          onChange={(e) => handleStepChange(index, e.target.value)}
                          required
                        />
                        {formData.steps.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(index)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Label>Badge Reward</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="badgeName">Badge Name</Label>
                        <Input
                          id="badgeName"
                          name="badgeName"
                          placeholder="e.g., Explorer Badge"
                          value={formData.badgeName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="badgeDescription">Badge Description</Label>
                        <Input
                          id="badgeDescription"
                          name="badgeDescription"
                          placeholder="e.g., Completed the Explorer quest"
                          value={formData.badgeDescription}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                      {formData.badgeImage ? (
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32 mb-4">
                            <img
                              src={URL.createObjectURL(formData.badgeImage) || "/placeholder.svg"}
                              alt="Badge Preview"
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{formData.badgeImage.name}</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData((prev) => ({ ...prev, badgeImage: null }))}
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop or click to upload badge image
                          </p>
                          <Input
                            id="badgeImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("badgeImage")?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Badge Image
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Quest..." : "Create Quest"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Quest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this quest? This will deploy a smart contract to the Starknet blockchain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateQuest} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Quest"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
